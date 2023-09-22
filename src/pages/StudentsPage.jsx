/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Checkbox,
  Input,
  Modal,
  Space,
  Table,
  message,
  Form,
  Image,
} from "antd";
import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import request from "../server";

const StudentsPage = () => {
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
      render: (posts) => {
        return <Image height={50} src={posts} />;
      },
    },
    {
      title: "IsWork",
      key: "isWork",
      dataIndex: "isWork",
      render: (posts) => (posts ? "Yes" : "No"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        console.log(record);
        return (
          <Space size="middle">
            <Button type="primary" onClick={() => edit(record.id)}>
              Edit
            </Button>
            <Button
              danger
              type="primary"
              onClick={() => {
                Modal.confirm({
                  title: "Confirm",
                  content: "Do you ant to delete this student?",
                  onOk: async () => {
                    await request.delete(
                      `/teachers/${id}/students/${record.id}`
                    );
                    getData();
                  },
                });
              }}
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  const { id } = useParams();
  console.log(id);
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    getData();
  }, [id]);

  async function getData() {
    try {
      setLoading(true);
      const res = await request.get(`/teachers/${id}/students`);
      setPosts(res.data);
    } catch (err) {
      message.error("Error");
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
        await request.post(`/teachers/${id}/students`, values);
      } else {
        await request.put(`/teachers/${id}/students/${selected}`, values);
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

  async function edit(idStu) {
    setSelected(idStu);
    setIsModalOpen(true);
    let { data } = await request.get(`/teachers/${id}/students/${idStu}`);
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
            <h1>Students({posts.length})</h1>
            <Button onClick={showModal} type="primary">
              Add
            </Button>
          </div>
        )}
        columns={columns}
        dataSource={posts}
        rowKey="id"
      />
      <Modal
        title="Student data"
        open={isModalOpen}
        onOk={handleOk}
        confirmLoading={btnLoading}
        onCancel={handleCancel}
        okText={selected === null ? "Add students" : "Save student"}
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
            label="Email"
            name="email"
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
            name="isWork"
            wrapperCol={{
              span: 24,
            }}
            valuePropName="checked"
          >
            <Checkbox>isWork</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default StudentsPage;
