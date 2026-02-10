import { Input } from "./input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Button } from "./button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Error from "./error";
import { login } from "@/db/apiAuth";
import { BeatLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import { UrlState } from "@/context";

const Login = () => {
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const { loading, error, fn: fnLogin, data } = useFetch(login, formData);
  const { fetchUser } = UrlState();

  useEffect(() => {
    if (!error && data) {
      fetchUser();
      navigate(`/dashboard${longLink ? `?createNew=${longLink}` : ""}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, data]);

  const handleLogin = async () => {
    setErrors({}); // ✅ FIXED (was [])
    try {
      const schema = Yup.object({
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
      });

      await schema.validate(formData, { abortEarly: false });
      await fnLogin();
    } catch (err) {
      const newErrors = {};
      err?.inner?.forEach((e) => {
        newErrors[e.path] = e.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Login to your account if you already have one
        </CardDescription>
        {error && <Error message={error.message} />}
      </CardHeader>

      {/* 🔥 MATCHES SIGNUP SPACING */}
      <CardContent className="space-y-3">
        <Input
          name="email"
          type="email"
          placeholder="Enter Email"
          onChange={handleInputChange}
        />
        {errors.email && <Error message={errors.email} />}

        <Input
          name="password"
          type="password"
          placeholder="Enter Password"
          onChange={handleInputChange}
        />
        {errors.password && <Error message={errors.password} />}
      </CardContent>

      <CardFooter>
        <Button onClick={handleLogin} disabled={loading} className="w-full">
          {loading ? <BeatLoader size={10} /> : "Login"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Login;
