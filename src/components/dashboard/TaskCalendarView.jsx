import { useState, useEffect } from "react";
import useStore from "../../store/useStore";
import TaskDetailsModal from "./TaskDetailsModal";
import AddTaskModal from "./AddTaskModal";

const TaskCalendarView = ({ tasks, loading }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [calendarDays, setCalendarDays] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [selectDateInCalendar, setSelectDateInCalendar] = useState();

  selectDateInCalendar && selectDateInCalendar.setDate(selectDateInCalendar.getDate() + 1);

  const handleMoreClick = (e, date) => {
    e.stopPropagation(); // Prevent calendar clicks
    setShowDropdown(!showDropdown);
    setSelectedDate(date);
  };

  // Generate calendar days for the current month
  useEffect(() => {
    const generateCalendar = () => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();

      // First day of the month
      const firstDay = new Date(year, month, 1);
      // Last day of the month
      const lastDay = new Date(year, month + 1, 0);

      // Day of week for the first day (0-6, where 0 is Sunday)
      const firstDayOfWeek = firstDay.getDay();

      // Total days in month
      const daysInMonth = lastDay.getDate();

      // Create array for the calendar
      const days = [];

      // Add empty days for days before the first of the month
      for (let i = 0; i < firstDayOfWeek; i++) {
        days.push({ day: null, date: null });
      }

      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        days.push({ day, date });
      }

      setCalendarDays(days);
    };

    generateCalendar();
  }, [currentMonth]);

  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    if (!date) return [];

    return tasks.filter((task) => {
      if (!task.dueDate) return false;

      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Previous month
  const prevMonth = () => {
    setCurrentMonth((prev) => {
      const prevMonth = new Date(prev);
      prevMonth.setMonth(prev.getMonth() - 1);
      return prevMonth;
    });
  };

  // Next month
  const nextMonth = () => {
    setCurrentMonth((prev) => {
      const nextMonth = new Date(prev);
      nextMonth.setMonth(prev.getMonth() + 1);
      return nextMonth;
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Month and year display
  const monthYear = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div className="calendar-container mb-4">
        <div className="calendar-header d-flex justify-content-between align-items-center mb-3">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={prevMonth}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <h3 className="mb-0">{monthYear}</h3>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={nextMonth}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        <div className="card">
          <div className="card-body p-0 p-sm-1">
            <div className="calendar">
              <div className="calendar-weekdays">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day, i) => (
                    <div key={i} className="calendar-weekday">
                      {day}
                    </div>
                  )
                )}
              </div>

              <div className="calendar-days">
                {calendarDays.map((dayObj, i) => {
                  const dayTasks = getTasksForDate(dayObj.date);
                  const isToday =
                    dayObj.date &&
                    dayObj.date.toDateString() === new Date().toDateString();

                  return (
                    <div
                      key={i}
                      className={`calendar-day ${
                        !dayObj.day ? "calendar-day-empty" : ""
                      } ${isToday ? "calendar-day-today" : ""}`}
                      role={dayObj.day ? "button" : ""}
                      onClick={() => {
                        dayObj.day &&
                          setSelectDateInCalendar(new Date(dayObj.date));
                      }}
                    >
                      {dayObj.day && (
                        <>
                          <div className="calendar-day-number">
                            {dayObj.day}
                          </div>
                          <div className="calendar-day-tasks">
                            {dayTasks.slice(0, 3).map((task, j) => (
                              <div
                                key={j}
                                className={`calendar-task ${
                                  task.completed
                                    ? "calendar-task-completed"
                                    : ""
                                } priority-${task.priority}`}
                                onClick={() => setSelectedTask(task)}
                              >
                                <span className="task-title">{task.title}</span>
                              </div>
                            ))}
                            {dayTasks.length > 3 && (
                              <div
                                className="calendar-task-more"
                                role="button"
                                onClick={(e) => handleMoreClick(e, dayObj.date)}
                              >
                                +{dayTasks.length - 3} more
                              </div>
                            )}
                            {showDropdown &&
                              selectedDate &&
                              selectedDate.getTime() ===
                                dayObj.date.getTime() && (
                                <div
                                  className="dropdown-menu show p-2 shadow d-flex gap-1 flex-column"
                                  style={{
                                    position: "absolute",
                                    top: "100%",
                                    zIndex: 10,
                                  }}
                                >
                                  <div className=" d-flex justify-content-between">
                                    <div className="fw-bold ms-3">
                                      {selectedDate
                                        .toDateString()
                                        .split(" ")[0] +
                                        " " +
                                        selectedDate
                                          .toDateString()
                                          .split(" ")[2] +
                                        ", " +
                                        selectedDate
                                          .toDateString()
                                          .split(" ")[1]}
                                    </div>
                                    <button
                                      className="text-white btn btn-close"
                                      onClick={() => setShowDropdown(false)}
                                    ></button>
                                  </div>
                                  {dayTasks.map((task, j) => (
                                    <div
                                      role="button"
                                      key={`dropdown-${j}`}
                                      className={`dropdown-item ${
                                        task.completed
                                          ? "calendar-task-completed"
                                          : ""
                                      } priority-${task.priority}`}
                                      onClick={() => {
                                        setSelectedTask(task);
                                      }}
                                    >
                                      {task.title}
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onHide={() => setSelectedTask(null)}
          date={selectDateInCalendar}
        />
      )}

      {selectDateInCalendar && (
        <AddTaskModal
          show={true}
          onHide={() => setSelectDateInCalendar()}
          date={selectDateInCalendar}
        />
      )}

      <style jsx="true">{`
        .calendar {
          width: 100%;
        }
        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          background-color: #f8f9fa;
          border-bottom: 1px solid #dee2e6;
        }
        .calendar-weekday {
          padding: 10px;
          text-align: center;
          font-weight: bold;
        }
        .calendar-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          grid-auto-rows: minmax(100px, auto);
        }
        .calendar-day {
          border: 1px solid #dee2e6;
          min-height: 50px;
          padding: 5px;
          position: relative;
        }
        .calendar-day-empty {
          background-color: #f8f9fa;
        }
        .calendar-day-today {
          background-color: #e8f4ff;
        }
        .calendar-day-number {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .calendar-day-tasks {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .calendar-task {
          padding: 2px 5px;
          border-radius: 3px;
          background-color: #e9ecef;
          font-size: 0.8rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor: pointer;
        }
        .calendar-task:hover {
          background-color: #dee2e6;
        }
        .calendar-task-completed {
          text-decoration: line-through;
          opacity: 0.7;
        }
        .priority-high {
          border-left: 3px solid #dc3545;
        }
        .priority-medium {
          border-left: 3px solid #ffc107;
        }
        .priority-low {
          border-left: 3px solid #28a745;
        }
        .calendar-task-more {
          font-size: 0.75rem;
          color: #6c757d;
          text-align: center;
        }
      `}</style>
    </>
  );
};

export default TaskCalendarView;
