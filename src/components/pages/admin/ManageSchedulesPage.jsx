import "../../../stylesheets/admin-main-page.css"
import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import {
  Scheduler,
  WeekView,
  DayView,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  Toolbar,
  DateNavigator,
} from '@devexpress/dx-react-scheduler-material-ui';
import { EditingState, IntegratedEditing, ViewState } from '@devexpress/dx-react-scheduler';
import { TextField, MenuItem, Select } from '@mui/material';
import { fetchEmployees } from "../../../api/employees";
import { DateTimePicker } from '@mui/x-date-pickers';
import { deleteSchedule, fetchSchedules, postSchedule, putSchedule } from "../../../api/schedules";


const ManageSchedulesPage = () => {


  // const [data, setData] = useState([
  //   {
  //       id: 1,
  //       title: 'Zmiana poranna - Recepcja',
  //       startDate: new Date(2024, 8, 5, 9, 0), // 5 września 2024, 9:00
  //       endDate: new Date(2024, 8, 5, 13, 0),  // 5 września 2024, 13:00
  //       notes:"XDDDDDasd",
  //       employeeId: 1,
  //   },
  //   {
  //       id: 2,
  //       title: 'Zmiana wieczorna - Ochrona',
  //       startDate: new Date(2024, 8, 5, 18, 0), // 5 września 2024, 18:00
  //       endDate: new Date(2024, 8, 5, 22, 0),  // 5 września 2024, 22:00
  //       employeeId: 2,
  //   },
  //   {
  //       id: 3,
  //       title: 'Zmiana na lunch - Kucharz',
  //       startDate: new Date(2024, 8, 6, 11, 0), // 6 września 2024, 11:00
  //       endDate: new Date(2024, 8, 6, 15, 0),  // 6 września 2024, 15:00
  //       employeeId: 3,
  //   },
  // ]);

  const [schedules, setSchedules] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentViewName, setCurrentViewName] = useState('Week');
  const [selectedPosition, setSelectedPosition] = useState('');
  const roles = [...new Set(employees.map(employee => employee.position))];

  const filteredData = selectedPosition
    ? schedules.filter(event => employees.find(employee => employee.id === event.employeeId)?.position === selectedPosition)
    : schedules;

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
  }

  const commitChanges = async ({ added, changed, deleted }) => {
    if (added) {
        added.startDate.setHours(added.startDate.getHours() + 2);
        added.endDate.setHours(added.endDate.getHours() + 2);
        
        added.startDate = added.startDate.toISOString().slice(0, -5);
        added.endDate = added.endDate.toISOString().slice(0, -5);
        await postSchedule(added);
        location.reload();
    }
    if (changed) {
      const [id, changedFields] = Object.entries(changed)[0];

        const originalSchedule = schedules.find(schedule => schedule.id === parseInt(id))
        const updatedSchedule = {
          ...originalSchedule,
          ...changedFields 
        };
        console.log(updatedSchedule)
        if (updatedSchedule.startDate) {
          updatedSchedule.startDate = new Date(updatedSchedule.startDate);
          updatedSchedule.startDate.setHours(updatedSchedule.startDate.getHours() + 2);
          updatedSchedule.startDate = updatedSchedule.startDate.toISOString().slice(0, -5);
      }
      if (updatedSchedule.endDate) {
          updatedSchedule.endDate = new Date(updatedSchedule.endDate);
          updatedSchedule.endDate.setHours(updatedSchedule.endDate.getHours() + 2);
          updatedSchedule.endDate = updatedSchedule.endDate.toISOString().slice(0, -5);
      }

        await putSchedule(id, updatedSchedule); 
        location.reload();
      }
    if (deleted !== undefined) {
      console.log(deleted);
      await deleteSchedule(deleted);
      location.reload();
    }
  };

  const EmployeeSelector = ({ appointmentData, onFieldChange }) => {
    const currentEmployeeId = appointmentData.employeeId || '';

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
      <MenuItem value="">Wszystkie</MenuItem>
      {roles.map((role) => (
        <MenuItem key={role} value={role}>
          {role}
        </MenuItem>
      ))}
    </Select>
  );

  const BasicLayout = ({ appointmentData, onFieldChange, ...restProps }) => (
    <div>
      <EmployeeSelector appointmentData={appointmentData} onFieldChange={onFieldChange} />
      <TextField
        label="Tytuł"
        value={appointmentData.title || ''}
        onChange={(e) => onFieldChange({ title: e.target.value })}
        fullWidth
      />
      <TextField
        label="Notatki"
        value={appointmentData.notes || ''}
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
        commitCommand: 'Zapisz'
      }}
    />
  );

  const CustomDateTimePicker = ({ value, onChange }) => (
    <DateTimePicker
      renderInput={(params) => <TextField {...params} fullWidth />}
      value={value}
      onChange={onChange}
      ampm={false} // Ustawienie na format 24-godzinny
      inputFormat="dd/MM/yyyy HH:mm" // Format wejściowy
    />
  );


  return (
    <Paper>
      <Scheduler data={filteredData} locale="pl">
        <ViewState
          currentDate={currentDate}
          onCurrentDateChange={setCurrentDate}
          currentViewName={currentViewName}
          onCurrentViewNameChange={handleViewChange}
        />
        <EditingState onCommitChanges={commitChanges} />
        <IntegratedEditing />
        <DayView startDayHour={9} endDayHour={22} />
        <WeekView startDayHour={9} endDayHour={22} />
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
  );
};

export default ManageSchedulesPage;
