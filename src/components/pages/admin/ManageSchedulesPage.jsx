import "../../../stylesheets/admin-main-page.css"
import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import {
  Scheduler,
  WeekView,
  MonthView,
  DayView,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  Toolbar,
  DateNavigator,
  ViewSwitcher,
} from '@devexpress/dx-react-scheduler-material-ui';
import { EditingState, IntegratedEditing, ViewState } from '@devexpress/dx-react-scheduler';
import { plPL } from '@mui/x-date-pickers/locales';
import { TextField, MenuItem } from '@mui/material';

const ManageSchedulesPage = () => {


    const [data, setData] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentViewName, setCurrentViewName] = useState('Week');
  
    useEffect(() => {
      const fetchData = async () => {

      };
  
      fetchData();
    }, []);
  
    const commitChanges = async ({ added, changed, deleted }) => {
      if (added) {

      }
      if (changed) {

      }
      if (deleted !== undefined) {

      }
    };
  
    const EmployeeSelector = ({ appointmentData, onFieldChange }) => {
      const currentEmployeeId = appointmentData.employeeId || '';
  
      return (
        <TextField
          select
          label="Select Employee"
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
      <AppointmentForm.BasicLayout
        appointmentData={appointmentData}
        onFieldChange={onFieldChange}
        {...restProps}
      >
        <EmployeeSelector appointmentData={appointmentData} onFieldChange={onFieldChange} />
      </AppointmentForm.BasicLayout>
    );
  
    const CustomAppointmentForm = (props) => (
      <AppointmentForm
        {...props}
        basicLayoutComponent={BasicLayout}
      />
    );
  
    return (
      <Paper>
        <Scheduler data={data} locale={plPL}>
          <ViewState
            currentDate={currentDate}
            onCurrentDateChange={setCurrentDate}
            currentViewName={currentViewName}
            onCurrentViewNameChange={setCurrentViewName}
          />
          <EditingState onCommitChanges={commitChanges} />
          <IntegratedEditing />
          <DayView startDayHour={9} endDayHour={17} />
          <WeekView startDayHour={9} endDayHour={17} />
          <MonthView />
          <Appointments />
          <AppointmentTooltip showOpenButton showDeleteButton />
          <CustomAppointmentForm />
          <Toolbar />
          <DateNavigator />
          <ViewSwitcher />
        </Scheduler>
      </Paper>
    );
  };

export default ManageSchedulesPage;
