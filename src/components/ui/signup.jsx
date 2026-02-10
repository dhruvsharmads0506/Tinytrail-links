import { useEffect, useState } from "react";
import Error from "./error";
import { Input } from "./input";
import * as Yup from "yup";
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
import { signup } from "@/db/apiAuth";
import { BeatLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";

const Signup = () => {
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const { loading, error, fn: fnSignup, data } = useFetch(signup, formData);

  useEffect(() => {
    if (!error && data) {
      navigate(`/dashboard${longLink ? `?createNew=${longLink}` : ""}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, data]);

  const handleSignup = async () => {
    setErrors({});
    try {
      const schema = Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
        profile_pic: Yup.mixed().required("Profile picture is required"),
      });

      await schema.validate(formData, { abortEarly: false });
      await fnSignup();
    } catch (err) {
      const newErrors = {};
      if (err?.inner) {
        err.inner.forEach((e) => {
          newErrors[e.path] = e.message;
        });
      } else {
        newErrors.api = err.message;
      }
      setErrors(newErrors);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signup</CardTitle>
        <CardDescription>
          Create a new account if you haven&rsquo;t already
        </CardDescription>
        {error && <Error message={error.message} />}
      </CardHeader>

      <CardContent className="space-y-3">
        <Input
          name="name"
          placeholder="Enter Name"
          onChange={handleInputChange}
        />
        {errors.name && <Error message={errors.name} />}

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

        {/* ✅ UPDATED FILE UPLOAD UI */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Profile Picture</label>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                document.getElementById("profile_pic_input").click()
              }
            >
              Choose File
            </Button>

            <span className="text-sm text-muted-foreground">
              {formData.profile_pic
                ? formData.profile_pic.name
                : "No file chosen"}
            </span>
          </div>

          <input
            id="profile_pic_input"
            name="profile_pic"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleInputChange}
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="h-20 w-20 rounded-full object-cover border"
            />
          )}

          {errors.profile_pic && <Error message={errors.profile_pic} />}
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={handleSignup} disabled={loading}>
          {loading ? <BeatLoader size={10} /> : "Create Account"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Signup;
