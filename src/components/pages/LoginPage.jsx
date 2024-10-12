import { useEffect, useState } from "react";
import "../../stylesheets/register-page.css";
import Footer from "../Footer";
import Navbar from "../Navbar";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchUser } from "../../api/users";
import FastFormField from "../FastFormField";
import { GoogleLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
  const { t } = useTranslation();
  const navigateTo = useNavigate();
  const location = useLocation();

  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [googleLoginError, setGoogleLoginError] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const message = queryParams.get("message");
    if (message === "activate") {
      setInfoMessage(t("accountActivationMessage"));
    }
  }, [location.search, t]);

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const idToken = response.credential;
      const backendResponse = await axios.post(
        "http://localhost:8080/auth/google-login",
        { idToken: idToken }
      );
      localStorage.setItem("token", backendResponse.data.token);
      const storedPath = localStorage.getItem("redirectPath");
      const fetchedUser = await fetchUser();
      if (storedPath) {
        localStorage.removeItem("redirectPath");
        navigateTo(storedPath);
      } else if (fetchedUser.role === "ROLE_ADMIN") {
        navigateTo("/admin");
      } else {
        navigateTo("/");
      }
    } catch (error) {
      setGoogleLoginError(t("googleLoginFailed"));
    }
  };

  const handleGoogleLoginError = (error) => {
    setGoogleLoginError(t("googleLoginFailed"));
    console.error(error);
  };

  return (
    <>
      <Navbar />
      <div className="register-page">
        <h1>{t("login")}</h1>
        {infoMessage && <p className="error">{infoMessage}</p>}
        <div>
          <div>
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
            />
          </div>
          {googleLoginError && <div>{googleLoginError}</div>}
        </div>
        <Formik
          initialValues={{
            username: "",
            password: "",
          }}
          validationSchema={Yup.object({
            username: Yup.string().required(t("enterEmail")),
            password: Yup.string().required(t("enterPassword")),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const response = await axios.post(
                "http://localhost:8080/auth/login",
                values
              );
              localStorage.setItem("token", response.data.token);
              const storedPath = localStorage.getItem("redirectPath");
              const fetchedUser = await fetchUser();
              if (storedPath) {
                localStorage.removeItem("redirectPath");
                navigateTo(storedPath);
              } else if (fetchedUser.role === "ROLE_ADMIN") {
                navigateTo("/admin");
              } else {
                navigateTo("/");
              }
            } catch (error) {
              if (error.response.status === 401) {
                setErrorMessage(t("invalidCredentials"));
              } else if (error.response.status === 403) {
                setErrorMessage(t("accountNotActivated"));
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {(formik) => (
            <Form>
              <FastFormField name="username" label={t("email")} type="text" />
              <FastFormField
                name="password"
                label={t("password")}
                type="password"
              />
              <button type="submit" disabled={formik.isSubmitting}>
                {t("login")}
              </button>
              {errorMessage && <p className="error">{errorMessage}</p>}
              {!formik.isValid && formik.submitCount > 0 && (
                <p className="error">{t("formErrors")}</p>
              )}
            </Form>
          )}
        </Formik>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
