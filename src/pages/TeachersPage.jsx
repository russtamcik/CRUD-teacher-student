import {
  Button,
  Checkbox,
  Form,
  Image,
  Input,
  Modal,
  Space,
  Table,
} from "antd";
import { Fragment, useEffect, useState } from "react";
import request from "../server";
import { Link } from "react-router-dom";

const TeachersPage = () => {
  const columns = [
    {
      title: "Firstname",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Lastname",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Image",
      dataIndex: "avatar",
      key: "avatar",
      render: (data) => {
        return <Image height={50} src={data} />;
      },
    },
    {
      title: "IsMarried",
      key: "isMarried",
      dataIndex: "isMarried",
      render: (data) => (data ? "Yes" : "No"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <Space
            size="middle"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button type="primary" onClick={() => edit(record.id)}>
              Edit
            </Button>
            <Button
              danger
              type="primary"
              onClick={() => {
                Modal.confirm({
                  title: "Confirm",
                  content: "Do you ant to delete this teacher?",
                  onOk: async () => {
                    await request.delete(`teachers/${record.id}`);
                    getData();
                  },
                });
              }}
            >
              Delete
            </Button>
            <Button type="primary">
              <Link to={`/students/${record.id}`}>
                See students {record.id}
              </Link>
            </Button>
          </Space>
        );
      },
    },
  ];

  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      setLoading(true);
      let { data } = await request.get("teachers");
      setData(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const showModal = () => {
    setSelected(null);
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      setBtnLoading(true);
      const values = await form.validateFields();
      if (selected === null) {
        await request.post("teachers", values);
      } else {
        await request.put(`teachers/${selected}`, values);
      }
      getData();
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
    } finally {
      setBtnLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  async function edit(id) {
    setSelected(id);
    setIsModalOpen(true);
    let { data } = await request.get(`teachers/${id}`);
    form.setFieldsValue(data);
  }

  return (
    <Fragment>
      <Table
        loading={loading}
        bordered
        title={() => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h1>Teachers({data.length})</h1>
            <Button onClick={showModal} type="primary">
              Add
            </Button>
          </div>
        )}
        columns={columns}
        dataSource={data}
        rowKey="id"
      />
      <Modal
        title="Teacher data"
        open={isModalOpen}
        onOk={handleOk}
        confirmLoading={btnLoading}
        onCancel={handleCancel}
        okText={selected === null ? "Add teacher" : "Save teacher"}
      >
        <Form
          form={form}
          name="modal"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          style={{
            maxWidth: 600,
          }}
          autoComplete="off"
        >
          <Form.Item
            label="Firstname"
            name="firstName"
            rules={[
              {
                required: true,
                message: "Please fill!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Lastname"
            name="lastName"
            rules={[
              {
                required: true,
                message: "Please fill",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Image"
            name="avatar"
            rules={[
              {
                required: true,
                message: "Please fill",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="isMarried"
            wrapperCol={{
              span: 24,
            }}
            valuePropName="checked"
          >
            <Checkbox>isMarried</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default TeachersPage;
