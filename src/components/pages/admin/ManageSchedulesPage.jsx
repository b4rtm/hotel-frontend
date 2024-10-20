import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import {
  Scheduler,
  WeekView,
  DayView,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  Toolbar,
  DateNavigator,
} from "@devexpress/dx-react-scheduler-material-ui";
import {
  EditingState,
  IntegratedEditing,
  ViewState,
} from "@devexpress/dx-react-scheduler";
import {
  TextField,
  MenuItem,
  Select,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { fetchEmployees, translateRole } from "../../../api/employees";
import { DateTimePicker } from "@mui/x-date-pickers";
import {
  deleteSchedule,
  fetchSchedules,
  postSchedule,
  putSchedule,
  sendSchedulesEmail,
} from "../../../api/schedules";
import { TreeItem, TreeView } from "@mui/lab";
import { ExpandMore, ChevronRight } from "@mui/icons-material";
import "../../../stylesheets/manage-schedules.css";

const ManageSchedulesPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentViewName, setCurrentViewName] = useState("Week");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState(new Set());

  const roles = [...new Set(employees.map((employee) => employee.position))];

  const filteredData = selectedPosition
    ? schedules.filter(
        (event) =>
          employees.find((employee) => employee.id === event.employeeId)
            ?.position === selectedPosition
      )
    : schedules;

  const handleToggleEmployee = (employeeId) => {
    setSelectedEmployees((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(employeeId)) {
        newSet.delete(employeeId);
      } else {
        newSet.add(employeeId);
      }
      return newSet;
    });
  };

  const handleTogglePosition = (position) => {
    const employeesInPosition = employees.filter(
      (employee) => employee.position === position
    );

    const allSelected = employeesInPosition.every((employee) =>
      selectedEmployees.has(employee.id)
    );

    setSelectedEmployees((prev) => {
      const newSet = new Set(prev);
      employeesInPosition.forEach((employee) => {
        if (allSelected) {
          newSet.delete(employee.id);
        } else {
          newSet.add(employee.id);
        }
      });
      return newSet;
    });
  };

  const handleSendEmail = async () => {
    if (selectedEmployees.size === 0) {
      alert("Wybierz co najmniej jednego pracownika.");
      return;
    }
    try {
      await sendSchedulesEmail({
        employeeIds: Array.from(selectedEmployees),
        startDate: currentDate,
      });
      alert("Grafiki zostały wysłane na e-mail wybranych pracowników.");
    } catch (error) {
      alert("Wystąpił błąd podczas wysyłania e-maili.");
    }
  };

  useEffect(() => {
    const fetchSchedulesData = async () => {
      const schedulesData = await fetchSchedules();
      setSchedules(schedulesData);
    };

    const fetchEmployeesData = async () => {
      const employeesData = await fetchEmployees();
      setEmployees(employeesData);
    };

    fetchSchedulesData();
    fetchEmployeesData();
  }, []);

  const handleViewChange = (viewName) => {
    setCurrentViewName(viewName);
  };

  const commitChanges = async ({ added, changed, deleted }) => {
    if (added) {
      added.startDate.setHours(added.startDate.getHours() + 2);
      added.endDate.setHours(added.endDate.getHours() + 2);
      added.notes = added.notes != null ? added.notes : "";
      added.startDate = added.startDate.toISOString().slice(0, -5);
      added.endDate = added.endDate.toISOString().slice(0, -5);
      await postSchedule(added);
      location.reload();
    }
    if (changed) {
      const [id, changedFields] = Object.entries(changed)[0];

      const originalSchedule = schedules.find(
        (schedule) => schedule.id === parseInt(id)
      );
      const updatedSchedule = {
        ...originalSchedule,
        ...changedFields,
      };
      if (updatedSchedule.startDate) {
        updatedSchedule.startDate = new Date(updatedSchedule.startDate);
        updatedSchedule.startDate.setHours(
          updatedSchedule.startDate.getHours() + 2
        );
        updatedSchedule.startDate = updatedSchedule.startDate
          .toISOString()
          .slice(0, -5);
      }
      if (updatedSchedule.endDate) {
        updatedSchedule.endDate = new Date(updatedSchedule.endDate);
        updatedSchedule.endDate.setHours(
          updatedSchedule.endDate.getHours() + 2
        );
        updatedSchedule.endDate = updatedSchedule.endDate
          .toISOString()
          .slice(0, -5);
      }
      added.notes = added.notes != null ? added.notes : "";

      await putSchedule(id, updatedSchedule);
      location.reload();
    }
    if (deleted !== undefined) {
      await deleteSchedule(deleted);
      location.reload();
    }
  };

  const EmployeeSelector = ({ appointmentData, onFieldChange }) => {
    const currentEmployeeId = appointmentData.employeeId || "";

    return (
      <TextField
        select
        label="Wybierz pracownika"
        value={currentEmployeeId}
        onChange={(e) => onFieldChange({ employeeId: e.target.value })}
        fullWidth
      >
        {employees.map((employee) => (
          <MenuItem key={employee.id} value={employee.id}>
            {employee.name}
          </MenuItem>
        ))}
      </TextField>
    );
  };

  const RoleSelector = ({ roles, selectedPosition, onRoleChange }) => (
    <Select
      value={selectedPosition}
      onChange={(e) => onRoleChange(e.target.value)}
      variant="outlined"
      displayEmpty
    >
      <MenuItem value="">Wszystkie stanowiska</MenuItem>
      {roles.map((role) => (
        <MenuItem key={role} value={role}>
          {translateRole(role)}
        </MenuItem>
      ))}
    </Select>
  );

  const BasicLayout = ({ appointmentData, onFieldChange, ...restProps }) => (
    <div>
      <EmployeeSelector
        appointmentData={appointmentData}
        onFieldChange={onFieldChange}
      />
      <TextField
        label="Tytuł"
        value={appointmentData.title || ""}
        onChange={(e) => onFieldChange({ title: e.target.value })}
        fullWidth
      />
      <TextField
        label="Notatki"
        value={appointmentData.notes || ""}
        onChange={(e) => onFieldChange({ notes: e.target.value })}
        multiline
        fullWidth
      />
      <label>Data rozpoczęcia</label>
      <CustomDateTimePicker
        value={appointmentData.startDate}
        onChange={(date) => onFieldChange({ startDate: date })}
      />
      <label>Data zakończenia</label>
      <CustomDateTimePicker
        value={appointmentData.endDate}
        onChange={(date) => onFieldChange({ endDate: date })}
      />
    </div>
  );

  const CustomViewSwitcher = ({ currentViewName, onChange }) => (
    <Select
      value={currentViewName}
      onChange={(e) => onChange(e.target.value)}
      variant="outlined"
      displayEmpty
    >
      <MenuItem value="Day">Dzień</MenuItem>
      <MenuItem value="Week">Tydzień</MenuItem>
    </Select>
  );

  const CustomAppointmentForm = (props) => (
    <AppointmentForm
      {...props}
      basicLayoutComponent={BasicLayout}
      messages={{
        commitCommand: "Zapisz",
      }}
    />
  );

  const CustomDateTimePicker = ({ value, onChange }) => (
    <DateTimePicker
      renderInput={(params) => <TextField {...params} fullWidth />}
      value={value}
      onChange={onChange}
      ampm={false}
      inputFormat="dd/MM/yyyy HH:mm"
    />
  );

  return (
    <div className="manage-schedules-page">
      <Paper>
        <div className="employee-selection">
          <h3>Wybierz pracowników do wysłania grafiku:</h3>
          <TreeView
            defaultCollapseIcon={<ExpandMore />}
            defaultExpandIcon={<ChevronRight />}
          >
            {roles.map((role) => (
              <TreeItem
                nodeId={role}
                key={role}
                label={
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={employees
                          .filter((employee) => employee.position === role)
                          .every((employee) =>
                            selectedEmployees.has(employee.id)
                          )}
                        indeterminate={employees
                          .filter((employee) => employee.position === role)
                          .some((employee) =>
                            selectedEmployees.has(employee.id)
                          )}
                        onChange={() => handleTogglePosition(role)}
                      />
                    }
                    label={translateRole(role)}
                  />
                }
              >
                {employees
                  .filter((employee) => employee.position === role)
                  .map((employee) => (
                    <TreeItem
                      nodeId={employee.id.toString()}
                      key={employee.id}
                      label={
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedEmployees.has(employee.id)}
                              onChange={() => handleToggleEmployee(employee.id)}
                            />
                          }
                          label={employee.name}
                        />
                      }
                    />
                  ))}
              </TreeItem>
            ))}
          </TreeView>
          <Button variant="contained" color="primary" onClick={handleSendEmail}>
            Wyślij grafiki na e-mail
          </Button>
        </div>
        <Scheduler data={filteredData} locale="pl">
          <ViewState
            currentDate={currentDate}
            onCurrentDateChange={setCurrentDate}
            currentViewName={currentViewName}
            onCurrentViewNameChange={handleViewChange}
          />
          <EditingState onCommitChanges={commitChanges} />
          <IntegratedEditing />
          <DayView startDayHour={0} endDayHour={24} />
          <WeekView startDayHour={0} endDayHour={24} />
          <Appointments />
          <AppointmentTooltip showOpenButton showDeleteButton />
          <CustomAppointmentForm />
          <Toolbar />
          <DateNavigator />
          <CustomViewSwitcher
            currentViewName={currentViewName}
            onChange={handleViewChange}
          />
          <RoleSelector
            roles={roles}
            selectedPosition={selectedPosition}
            onRoleChange={setSelectedPosition}
          />
        </Scheduler>
      </Paper>
    </div>
  );
};

export default ManageSchedulesPage;
