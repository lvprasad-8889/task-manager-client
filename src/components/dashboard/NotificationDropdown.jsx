import React, { useEffect, useState } from "react";
import useStore from "../../store/useStore";

const icon = {
  "Task Created": <i className="fas fa-plus-circle text-primary"></i>,
  "Task Updated": <i className="fas fa-edit text-info"></i>,
  "Task Deleted": <i className="fas fa-trash-alt text-danger"></i>,
  "Task Due Soon": <i className="fas fa-exclamation-circle text-warning"></i>,
  "Task Completed": <i className="fas fa-check-circle text-success"></i>,
  "Overdue Task": <i className="fas fa-exclamation-circle text-danger"></i>,
};

export function getTimeAgo(pastDate) {
  const now = new Date();
  const past = new Date(pastDate);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return "less than a minute ago";
  if (diffInSeconds < 120) return "a minute ago";

  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 30) return `${minutes} minutes ago`;
  if (minutes < 60) return "half an hour ago";

  const hours = Math.floor(minutes / 60);
  if (hours === 1) return "an hour ago";
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "a day ago";
  return `${days} days ago`;
}

const NotificationDropdown = () => {
  // const initialNotifications = [
  //   {
  //     id: 1,
  //     text: "New message from John",
  //     title: "hello one",
  //     unread: true,
  //     eventType: "Task Created",
  //     updatedAt: "2025-04-08T19:10:45.123Z",
  //   },
  //   {
  //     id: 2,
  //     text: " Design update so can you do th ework",
  //     title: "hello two",
  //     unread: true,
  //     eventType: "Task Updated",
  //     updatedAt: "2025-04-08T15:30:45.123Z",
  //   },
  //   {
  //     id: 3,
  //     text: "Server maintenance at 2AM",
  //     title: "hello three",
  //     unread: true,
  //     eventType: "Task Deleted",
  //     updatedAt: "2025-04-08T15:30:45.123Z",
  //   },
  //   {
  //     id: 4,
  //     text: "Server maintenance at 2AM",
  //     title: "hello three",
  //     unread: true,
  //     eventType: "Task Due soon",
  //     updatedAt: "2025-04-08T15:30:45.123Z",
  //   },
  //   {
  //     id: 5,
  //     text: "Server maintenance at 2AM",
  //     title: "hello three",
  //     unread: true,
  //     eventType: "Task Completed",
  //     updatedAt: "2025-04-08T15:30:45.123Z",
  //   },
  // ];

  let {
    notifications,
    getUserNotifications,
    readAllUserNotifications,
    readUserNotification,
    removeUserNotification,
  } = useStore();

  const markAllAsRead = () => {
    // const updated = notifications.map((n) => ({ ...n, unread: false }));
    // setNotifications(updated);
    readAllUserNotifications();
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    getUserNotifications();
  }, []);

  console.log(notifications);

  return (
    <div className="dropdown">
      <div
        className="position-relative"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i className="fas fa-bell fa-lg text-white"></i>

        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount}
          </span>
        )}
      </div>

      <ul
        className="dropdown-menu dropdown-menu-end shadow"
        style={{ width: "340px", maxHeight: "60vh", overflow: "auto" }}
      >
        <li className="dropdown-header d-flex justify-content-between align-items-center px-3 py-2">
          <span className="text-black fw-bold">Notifications</span>
          {unreadCount > 0 && (
            <button
              className="btn btn-link p-0 text-decoration-none"
              onClick={markAllAsRead}
            >
              Mark all as read
            </button>
          )}
        </li>

        {notifications.length ? (
          <div id="notificationList">
            {notifications.map((n, index) => (
              <li
                key={index}
                className={`px-3 py-2 dropdown-item d-flex align-items-center justify-content-between ${
                  n.unread ? "bg-light fw-semibold" : ""
                }`}
              >
                <div className="container-fluid">
                  <div className="row align-items-start">
                    <div className="col-2">{icon[n.eventType]}</div>
                    <span className="col-10">
                      <div>{n.eventType}</div>
                      <div
                        className=" text-truncate text-muted fw-normal"
                        style={{ fontSize: "14px" }}
                      >
                        {n.text}
                      </div>

                      <div
                        className="d-flex justify-content-between fw-normal mt-2"
                        style={{ fontSize: "12px" }}
                      >
                        {getTimeAgo(n.updatedAt)}
                        <div className="d-flex gap-3 align-items-center">
                          {
                            n.unread && <i
                            className="fas fa-check"
                            role="button"
                            onClick={() => readUserNotification(n._id)}
                            title="Mark this notification as read"
                          ></i>
                          }
                          <i
                            className="fas fa-times"
                            role="button"
                            onClick={() => removeUserNotification(n._id)}
                            title="Remove notification"
                          ></i>
                        </div>
                      </div>
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </div>
        ) : (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ width: "100%", height: "50vh" }}
          >
            <div>
              <div className="fw-bold text-center">No notifications yet</div>
              <div>try adding or updating tasks</div>
            </div>
          </div>
        )}
      </ul>
    </div>
  );
};

export default NotificationDropdown;
