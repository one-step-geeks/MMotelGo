import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  DrawerForm,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProCard,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import {
  Form,
  message,
  Input,
  DatePicker,
  InputNumber,
  TreeSelect,
  Button,
} from 'antd';
import type { DefaultOptionType } from 'antd/es/select';
import services from '@/services';
import { OrderState } from '@/services/OrderController';
import moment from 'moment';
import { useRequest } from 'umi';

import './style.less';

type RoomProp = Omit<ORDER.OrderRoom, 'roomDesc' | 'key'>;

interface Props {
  id?: number;
  rooms?: Array<RoomProp>;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
  onSubmited: () => void;
}

export interface FormOrder extends ORDER.OrderBase {
  orderRoomList: Array<ORDER.OrderRoom>;
}

export default (props: Props) => {
  const [form] = Form.useForm<FormOrder>();
  const [treeData, setTreeData] = useState<Omit<DefaultOptionType, 'label'>[]>(
    [],
  );
  const roomsValue = Form.useWatch('orderRoomList', form);

  useEffect(() => {
    // console.log('props.rooms', props.rooms);
    if (props.rooms) {
      const orderRoomList = props.rooms.reduce(
        (acc: Array<RoomProp>, cur: RoomProp) => {
          const splitedRooms = [];
          // 跨多天的订单，将其拆分为多条房间记录
          for (let i = 0; i < cur.checkInDays; i++) {
            splitedRooms.push({
              ...cur,
              roomPrice: cur.priceList[i],
              checkInDate: moment(cur.checkInDate).add(i, 'day'),
              roomDesc: `${cur.roomTypeName}-${cur.roomCode}`,
            });
          }
          return [...acc, ...splitedRooms];
        },
        [],
      );
      // console.log('orderRoomList', orderRoomList);
      form.setFieldsValue({
        orderRoomList,
      });
    }
  }, [props.rooms]);

  useRequest(
    () => {
      if (props.visible && props.id) {
        return services.OrderController.queryDetail(props.id).then(
          (orderRes) => {
            const {
              data: { orderRoomList, order },
            } = orderRes;
            // setOrderStatus(order.status);
            form.setFieldsValue({
              ...order,
              orderRoomList: orderRoomList.map(({ checkInDate, ...rest }) => {
                return {
                  ...rest,
                  checkInDate: moment(checkInDate),
                  roomDesc: `${rest.roomTypeName}-${rest.roomCode}`,
                };
              }),
            });
          },
        );
      }
      return Promise.resolve({});
    },
    {
      refreshDeps: [props.id, props.visible],
    },
  );

  const onLoadRoomTree = async (open: boolean, checkInDate: string) => {
    if (open) {
      const { data } = await services.OrderController.queryObservableRooms(
        checkInDate,
      );
      const { orderRoomList } = form.getFieldsValue();
      const addedRoomIds = orderRoomList.map((room) => room.roomId);
      const treeDataInited = data?.list?.map((roomType) => {
        const { roomTypeId: id, roomTypeName, roomList } = roomType;
        return {
          id,
          value: id as number,
          title: roomTypeName,
          isLeaf: false,
          pid: 0, // 0 stand for root
          selectable: false,
          checkable: false,
          children: roomList?.map(
            ({ roomId, roomCode, isOccupy, roomPrice }) => {
              // const roomOccupied = occupiedRoomIds.includes(Number(cid));// % 2 === 0;
              const isOccupyOrSelected =
                addedRoomIds.includes(roomId) || isOccupy === 1;
              return {
                id: roomId as number,
                value: `${roomTypeName}-${roomCode}`,
                title: isOccupyOrSelected ? `${roomCode} 已占用` : roomCode,
                isLeaf: true,
                price: roomPrice,
                disabled: isOccupyOrSelected,
                pid: roomId,
              };
            },
          ),
        };
      });
      setTreeData(treeDataInited || []);
    } else {
      setTreeData([]);
    }
  };

  const isEdit = !!props?.id;
  // | 'orderStatus'>
  return (
    <DrawerForm<Omit<FormOrder, 'id' | 'status'>>
      title={isEdit ? '编辑订单' : '新建订单'}
      form={form}
      layout="horizontal"
      grid
      className="order-form-drawer"
      autoFocusFirstInput
      visible={props.visible}
      preserve={false}
      drawerProps={{
        width: 640,
        destroyOnClose: true,
        maskClosable: false,
        onClose: (value) => {
          form.resetFields();
          props.onVisibleChange(false);
        },
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        const { orderRoomList, ...rest } = values;
        console.log('orderRoomList', orderRoomList);
        if (rest.reserveName?.trim() || rest.reservePhone?.trim()) {
          const submitData = {
            order: {
              id: props?.id,
              status: OrderState.IS_ORDERED,
              ...rest,
            },
            orderRoomList: orderRoomList.map((orderRoom) => {
              // 对于新增的房间，只有roomDesc，需要获取到roomId用于提交
              let {
                roomPrice,
                roomDesc,
                roomId,
                checkInDate,
                ...rest
              } = orderRoom;

              return {
                roomId,
                checkInDate: moment(checkInDate).format('YYYY-MM-DD'),
                // // 房间状态可能和订单状态有差异，新增时候保持一致
                status: OrderState.IS_ORDERED,
                checkInPersonCount: 0,
                roomPrice,
                ...rest,
                // 是最早方案设计中会需要totalAmount，代表预多天的订单的房价总和
                // 但目前将多天拆分了多条记录，房价roomPrice*1 恒等于 totalAmount
                // 后端仍旧依赖totalAmount字段，因此暂时冗余它
                // 覆盖传入totalAmount：房态位置传入值是roomPrice*n的结果（n是预定天数）
                totalAmount: roomPrice,
              };
            }),
          };
          console.log('submitData', submitData);
          try {
            await services.OrderController[isEdit ? 'update' : 'add'](
              submitData,
            );
            message.success(isEdit ? '保存成功' : '新建成功');
            form.resetFields();
            props.onSubmited();
            return true;
          } catch (err) {}
        } else {
          message.warn('姓名/电话至少填一个');
        }
      }}
      submitter={{
        render: (props, defaultDoms) => {
          return [
            <Button
              key="submit"
              type="primary"
              onClick={() => {
                props.submit();
              }}
            >
              提交订单
            </Button>,
          ];
        },
      }}
    >
      <ProCard title="基本信息">
        <ProForm.Group>
          <ProFormText
            colProps={{ md: 12 }}
            labelAlign="right"
            name="reserveName"
            width="md"
            label="姓名"
            placeholder="请输入姓名"
          />
          <ProFormText
            colProps={{ md: 12 }}
            labelAlign="right"
            name="reservePhone"
            width="md"
            label="电话"
            placeholder="请输入电话"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            colProps={{ md: 12 }}
            label="渠道"
            name="channelType"
            fieldProps={{
              optionItemRender(item) {
                return (
                  <span>
                    <span
                      style={{ backgroundColor: item.color }}
                      className="color-brick"
                    ></span>
                    <span>{item.label}</span>
                  </span>
                );
              },
            }}
            request={async () => {
              const { data } = await services.ChannelController.queryChannels();
              return data.map((row) => ({
                label: row.name,
                value: row.id,
                color: row.color,
              }));
            }}
          />
        </ProForm.Group>
      </ProCard>

      <ProCard
        title="房间信息"
        extra={`共${roomsValue && roomsValue.length}间房`}
      >
        <Form.List name="orderRoomList">
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => {
                return (
                  <Form.Item key={field.key}>
                    <Input.Group compact>
                      <Form.Item
                        name={[field.name, 'checkInDate']}
                        noStyle
                        initialValue={moment()}
                      >
                        <DatePicker
                          disabled={
                            !!props.id &&
                            form.getFieldValue('orderRoomList')[index]
                              ?.status == OrderState.IS_CHECKED
                          }
                          style={{ width: '30%' }}
                          format="MM/DD/YYYY"
                        />
                      </Form.Item>
                      {/* integer, min 1 */}

                      <Form.Item name={[field.name, 'roomDesc']} noStyle>
                        <TreeSelect
                          treeDataSimpleMode
                          style={{ width: '40%' }}
                          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                          placeholder="请选择房间"
                          treeData={treeData}
                          onDropdownVisibleChange={(value) => {
                            console.log('field.name', field.name);
                            const { orderRoomList } = form.getFieldsValue();
                            const fieldRow = orderRoomList[field.name];
                            const checkInDate =
                              fieldRow.checkInDate &&
                              fieldRow.checkInDate.format('YYYY-MM-DD');
                            onLoadRoomTree(value, checkInDate);
                          }}
                          onSelect={(value, node) => {
                            // 更新房间的价格
                            const { price, id } = node;
                            const { orderRoomList } = form.getFieldsValue();
                            const room = orderRoomList.find(
                              (room) => room.roomDesc === value,
                            );
                            room!.roomId = id;
                            room!.roomPrice = price;
                            form.setFieldsValue({ orderRoomList });
                          }}
                        />
                      </Form.Item>

                      <Form.Item name={[field.name, 'roomPrice']} noStyle>
                        <InputNumber
                          style={{ width: '25%' }}
                          formatter={(value) => {
                            let feeValue = value;
                            const valueStr = value?.toString();
                            const match = valueStr && valueStr.match(/\.\d+/);
                            // 超出3位，精确到小数点后2位即可
                            if (match && match[0].length > 3) {
                              feeValue =
                                parseInt(valueStr) + match[0].slice(0, 3);
                            }
                            return `A$ ${feeValue}`;
                          }}
                          parser={(value) => value!.replace(/A\$\s?/g, '')}
                        ></InputNumber>
                      </Form.Item>

                      {fields.length > 1 &&
                      form.getFieldValue('orderRoomList')[index]?.status !=
                        OrderState.IS_CHECKED ? (
                        <DeleteOutlined
                          style={{
                            padding: '10px 5px',
                          }}
                          onClick={() => {
                            remove(field.name);
                          }}
                        ></DeleteOutlined>
                      ) : null}

                      {/* sub fields start */}

                      <Form.List name={[field.name, 'orderRoomPersonList']}>
                        {(
                          personFields,
                          { add: add2, remove: remove2 },
                          { errors },
                        ) => (
                          <>
                            {personFields.map((personField, index) => {
                              return (
                                <Form.Item
                                  className="person-row"
                                  key={personField.key}
                                >
                                  <Input.Group compact>
                                    <ProFormText
                                      name={[personField.name, 'name']}
                                      placeholder="入住人姓名"
                                    ></ProFormText>
                                    <ProFormText
                                      name={[personField.name, 'phoneNo']}
                                      placeholder="联系方式"
                                    ></ProFormText>
                                    <DeleteOutlined
                                      style={{
                                        padding: '10px 5px',
                                      }}
                                      onClick={() => {
                                        remove2(field.name);
                                      }}
                                    ></DeleteOutlined>
                                  </Input.Group>
                                </Form.Item>
                              );
                            })}

                            <Form.Item>
                              <Button
                                type="link"
                                onClick={() => {
                                  add2();
                                }}
                                icon={<PlusOutlined />}
                              >
                                添加入住人
                              </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>

                      {/* sub  fields end */}
                    </Input.Group>
                  </Form.Item>
                );
              })}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                    // setRoomInfos([...roomInfos, ])
                  }}
                  icon={<PlusOutlined />}
                >
                  添加房间
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </ProCard>
      <ProCard title={false}>
        <ProFormTextArea
          fieldProps={{
            maxLength: 2048,
            showCount: true,
          }}
          name="remark"
          placeholder="备注信息"
        />
      </ProCard>
    </DrawerForm>
  );
};
