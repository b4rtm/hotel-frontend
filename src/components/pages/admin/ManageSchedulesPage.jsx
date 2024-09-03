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
  ViewSwitcher,
} from '@devexpress/dx-react-scheduler-material-ui';
import { EditingState, IntegratedEditing, ViewState } from '@devexpress/dx-react-scheduler';
import { TextField, MenuItem, Select } from '@mui/material';
import { fetchEmployees } from "../../../api/employees";
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const ManageSchedulesPage = () => {


  const [data, setData] = useState([
    {
        id: 1,
        title: 'Zmiana poranna - Recepcja',
        startDate: new Date(2024, 8, 5, 9, 0), // 5 września 2024, 9:00
        endDate: new Date(2024, 8, 5, 13, 0),  // 5 września 2024, 13:00
        employeeId: 1,
    },
    {
        id: 2,
        title: 'Zmiana wieczorna - Ochrona',
        startDate: new Date(2024, 8, 5, 18, 0), // 5 września 2024, 18:00
        endDate: new Date(2024, 8, 5, 22, 0),  // 5 września 2024, 22:00
        employeeId: 2,
    },
    {
        id: 3,
        title: 'Zmiana na lunch - Kucharz',
        startDate: new Date(2024, 8, 6, 11, 0), // 6 września 2024, 11:00
        endDate: new Date(2024, 8, 6, 15, 0),  // 6 września 2024, 15:00
        employeeId: 3,
    },
  ]);
  const [employees, setEmployees] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentViewName, setCurrentViewName] = useState('Week');

  useEffect(() => {
    const fetchData = async () => {
      const employeesData = await fetchEmployees();
      setEmployees(employeesData);
    };

    fetchData();
  }, []);

  const handleViewChange = (viewName) => {
    setCurrentViewName(viewName);
  }

  const commitChanges = async ({ added, changed, deleted }) => {
    if (added) {
      // Obsługa dodawania
      console.log('Dodano nowe wydarzenie:', added);
    }
    if (changed) {
      // Obsługa zmieniania
      console.log('Zmodyfikowano wydarzenie:', changed);
    }
    if (deleted !== undefined) {
      // Obsługa usuwania
      console.log('Usunięto wydarzenie o ID:', deleted);
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
      mask="__ / __ / ____ __:__" // Maski wejściowe dla lepszej użyteczności
    />
  );


  return (
    <Paper>
      <Scheduler data={data} locale="pl">
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
        </Scheduler>
    </Paper>
  );
};

export default ManageSchedulesPage;
