import { useEffect, useState } from "react";
import request from "../server";
import { Image, Table } from "antd";

const AllStudentsPage = () => {
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
  ];
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      setLoading(true);
      let { data } = await request.get("teachers");

      const promises = data.map((teacher) =>
        request.get(`teachers/${teacher.id}/students`)
      );

      const results = await Promise.all(promises);
      const flattenedData = results.map((response) => response.data).flat();
      setData(flattenedData);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  console.log(data);

  return (
    <div>
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
            <h1>Students({data.length})</h1>
          </div>
        )}
        columns={columns}
        dataSource={data}
        rowKey="id"
      />
    </div>
  );
};

export default AllStudentsPage;
