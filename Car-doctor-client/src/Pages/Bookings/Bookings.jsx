import { useEffect, useState } from "react";
// import { AuthContext } from "../../Providers/Provider";
import Booktable from "./Booktable";
// import axios from "axios";
import useAxios from "../../Hooks/useAxios";

const Bookings = () => {
  // const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const axiosSecure = useAxios();

  const url = `/bookings?email=rifat@gmail.com`;
  useEffect(() => {
    axiosSecure.get(url).then((res) => setBookings(res.data));
    // axios.get(url, { withCredentials: true }).then((res) => {
    //   setBookings(res.data);
    // });
    // fetch(url)
    //   .then((res) => res.json())
    //   .then((data) => setBookings(data));
  }, [axiosSecure, url]);

  const handleDelete = (id, service) => {
    const proceed = confirm("Are you sure you want to delete?");
    if (proceed) {
      fetch(`http://localhost:5000/bookings/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.deletedCount > 0) {
            alert(`${service} Deleted Successfully !`);
            const remaining = bookings.filter((booking) => booking._id !== id);
            setBookings(remaining);
          }
        });
    }
  };

  const handleConfirm = (id) => {
    const proceed = confirm("Are you sure you want to confirm?");
    if (proceed) {
      fetch(`http://localhost:5000/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ status: "confirm" }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.modifiedCount > 0) {
            // update state
            const remaining = bookings.filter((booking) => booking._id !== id);
            const updated = bookings.find((booking) => booking._id === id);
            updated.status = "confirm";
            const newBooking = [updated, ...remaining];
            setBookings(newBooking);
          }
        });
    }
  };

  return (
    <div>
      <h2>{bookings.length}</h2>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Image</th>
              <th>Service</th>
              <th>Date</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <Booktable
                key={booking._id}
                booking={booking}
                handleDelete={handleDelete}
                handleConfirm={handleConfirm}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;
