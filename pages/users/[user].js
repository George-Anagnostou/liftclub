import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
// Utils
import { getUserData } from "../../utils/api";
// Components
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function User() {
  const router = useRouter();
  const { user } = router.query;

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const data = await getUserData(user);
      setUserData(data);
    };

    getData();
  }, [user]);

  return (
    <Layout>
      <div>{userData ? <p>{userData.username}</p> : <LoadingSpinner />}</div>
    </Layout>
  );
}
