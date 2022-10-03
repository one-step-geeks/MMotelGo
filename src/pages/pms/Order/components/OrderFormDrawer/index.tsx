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
  Select,
  DatePicker,
  InputNumber,
  TreeSelect,
  Button,
} from 'antd';
import services from '@/services';
import type { DefaultOptionType } from 'antd/es/select';
import moment from 'moment';
import { useRequest } from 'umi';

import './style.less';
import { OrderState } from '@/services/OrderController';

interface Props {
  id?: number;
  rooms?: Array<Omit<ORDER.OrderRoom, 'roomDesc' | 'key'>>;
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
    if (props.rooms) {
      form.setFieldsValue({
        orderRoomList: props.rooms.map((room) => ({
          ...room,
          roomDesc: `${room.roomTypeName}-${room.roomCode}`,
        })),
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
              orderRoomList: orderRoomList.map(({ startDate, ...rest }) => {
                return {
                  ...rest,
                  startDate: moment(startDate),
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

  const onLoadRoomTree = async (open: boolean, startDate: string) => {
    if (open) {
      console.log('startDate', startDate);
      // queryObservableRooms
      const { data } = await services.OrderController.queryObservableRooms(
        startDate,
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

  // console.log('props.room', props.room)

  const isEdit = !!props?.id;
  // | 'orderStatus'>
  return (
    <DrawerForm<Omit<FormOrder, 'id' | 'status'>>
      title={isEdit ? '编辑订单' : '新建订单'}
      form={form}
      layout="horizontal"
      grid
      autoFocusFirstInput
      visible={props.visible}
      preserve={false}
      drawerProps={{
        width: 540,
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
        const submitData = {
          order: {
            id: props?.id,
            status: OrderState.IS_ORDERED,
            ...rest,
          },
          orderRoomList: orderRoomList.map((orderRoom) => {
            // 对于新增的房间，只有roomDesc，需要获取到roomId用于提交
            let { roomDesc, roomId, startDate, ...rest } = orderRoom;
            return {
              roomId,
              startDate: moment(startDate).format('YYYY-MM-DD'),
              // // 房间状态可能和订单状态有差异，新增时候保持一致
              status: OrderState.IS_ORDERED,
              checkInPersonCount: 0,
              ...rest,
            };
          }),
        };
        console.log('submitData', submitData);
        try {
          await services.OrderController[isEdit ? 'update' : 'add'](submitData);
          message.success(isEdit ? '保存成功' : '新建成功');
          form.resetFields();
          props.onSubmited();
          return true;
        } catch (err) {}
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
                        name={[field.name, 'startDate']}
                        noStyle
                        initialValue={moment()}
                      >
                        <DatePicker
                          disabled={
                            !!props.id &&
                            form.getFieldValue('orderRoomList')[index]
                              ?.status == OrderState.IS_CHECKED
                          }
                          style={{ width: '25%' }}
                        ></DatePicker>
                      </Form.Item>
                      {/* integer, min 1 */}

                      <Form.Item
                        name={[field.name, 'checkInDays']}
                        noStyle
                        initialValue={1}
                      >
                        <InputNumber
                          formatter={(value) => {
                            const number = Math.max(Number(value), 1);
                            return `${number}晚`;
                          }}
                          parser={(value) => {
                            const parsed = value!.replace(/晚/g, '');
                            console.log('parsed', parsed);
                            return Number(parsed);
                          }}
                          style={{ width: '15%' }}
                          onChange={(value: number) => {
                            const { orderRoomList } = form.getFieldsValue();
                            const room = orderRoomList[index];
                            const { checkInDays, roomPrice } = room;
                            console.log(
                              'liveDaychanged',
                              roomPrice,
                              checkInDays,
                            );
                            room.totalAmount = roomPrice * checkInDays;
                            form.setFieldsValue({ orderRoomList });
                          }}
                        />
                      </Form.Item>

                      {/* <Form.Item name={[field.name, 'roomId']}></Form.Item> */}
                      {/* <Form.Item name={[field.name, 'roomPrice']}></Form.Item> */}
                      <Form.Item name={[field.name, 'roomDesc']} noStyle>
                        <TreeSelect
                          treeDataSimpleMode
                          style={{ width: '35%' }}
                          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                          placeholder="请选择房间"
                          treeData={treeData}
                          onDropdownVisibleChange={(value) => {
                            console.log('field.name', field.name);
                            const { orderRoomList } = form.getFieldsValue();
                            const fieldRow = orderRoomList[field.name];
                            const startDate =
                              fieldRow.startDate &&
                              fieldRow.startDate.format('YYYY-MM-DD');
                            // console.log("orderRoomList[field.name]", orderRoomList[field.name]);
                            onLoadRoomTree(value, startDate);
                          }}
                          onSelect={(value, node) => {
                            // 更新房间的价格
                            const { price, id } = node;
                            const { orderRoomList } = form.getFieldsValue();
                            const room = orderRoomList.find(
                              (room) => room.roomDesc === value,
                            );
                            const day = room!.checkInDays;
                            console.log('treeChanged', price, day);
                            room!.totalAmount = price * day;
                            room!.roomId = id;
                            room!.roomPrice = price;
                            form.setFieldsValue({ orderRoomList });
                          }}
                        />
                      </Form.Item>

                      <Form.Item name={[field.name, 'totalAmount']} noStyle>
                        <InputNumber
                          style={{ width: '20%' }}
                          formatter={(value) => {
                            console.log('InputNumber', value);
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
        <ProFormTextArea name="remark" placeholder="备注信息" />
      </ProCard>
    </DrawerForm>
  );
};
