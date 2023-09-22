import { useEffect, useState } from "react";
import request from "../server";
import { Table } from "antd";

const DashboardPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

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
  return (
    <div>
      <Table
        loading={loading}
        title={() => <h1>All Teachers({data.length})</h1>}
        dataSource={data}
        rowKey="id"
      />
    </div>
  );
};

export default DashboardPage;
