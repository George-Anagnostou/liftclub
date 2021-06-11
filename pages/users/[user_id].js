import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
// Utils
import { getUserData } from "../../utils/api";
// Components
import LoadingSpinner from "../../components/LoadingSpinner";

export default function User_id() {
  const router = useRouter();
  const { user_id } = router.query;

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const data = await getUserData(user_id);
      setUserData(data);
    };

    getData();
  }, [user_id]);

  return (
    <div>
      {userData ? (
        <div>
          <p>{userData.username}</p>
          <p>Workouts completed: {userData.workoutLog.length}</p>
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
}
