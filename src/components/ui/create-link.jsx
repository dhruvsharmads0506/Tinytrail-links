import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card } from "../ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Error from "./error";
import * as yup from "yup";
import useFetch from "@/hooks/use-fetch";
import { createUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";
import { UrlState } from "@/context";
import { QRCode } from "react-qrcode-logo";

export function CreateLink() {
  const { user } = UrlState();
  const navigate = useNavigate();
  const qrRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longLink || "",
    customUrl: "",
  });

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup
      .string()
      .url("Must be a valid URL")
      .required("Long URL is required"),
    customUrl: yup.string(),
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };

  const {
    loading,
    error,
    data,
    fn: fnCreateUrl,
  } = useFetch(createUrl, { ...formValues, user_id: user.id });

  useEffect(() => {
    if (!error && data) {
      navigate(`/link/${data[0].id}`);
    }
  }, [error, data, navigate]);

  const createNewLink = async () => {
    setErrors({});
    try {
      await schema.validate(formValues, { abortEarly: false });

      // ✅ SAFETY CHECK
      if (!qrRef.current?.canvasRef?.current) {
        throw new Error("QR code not ready");
      }

      const canvas = qrRef.current.canvasRef.current;

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );

      if (!blob) {
        throw new Error("Failed to generate QR image");
      }

      await fnCreateUrl(blob);
    } catch (e) {
      if (e.inner) {
        const newErrors = {};
        e.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      } else {
        setErrors({ message: e.message });
      }
    }
  };

  return (
    <Dialog
      defaultOpen={!!longLink}
      onOpenChange={(open) => {
        if (!open) setSearchParams({});
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive">Create New Link</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">
            Create New
          </DialogTitle>
        </DialogHeader>

        {formValues.longUrl && (
          <QRCode
            ref={qrRef}
            size={250}
            value={formValues.longUrl}
            bgColor="#ffffff"
            fgColor="#000000"
          />
        )}

        <Input
          id="title"
          placeholder="Short Link's Title"
          value={formValues.title}
          onChange={handleChange}
        />
        {errors.title && <Error message={errors.title} />}

        <Input
          id="longUrl"
          placeholder="Enter your Loooong URL"
          value={formValues.longUrl}
          onChange={handleChange}
        />
        {errors.longUrl && <Error message={errors.longUrl} />}

        <div className="flex items-center gap-2">
          <Card className="p-2">trimrr.in</Card> /
          <Input
            id="customUrl"
            placeholder="Custom Link (optional)"
            value={formValues.customUrl}
            onChange={handleChange}
          />
        </div>

        {errors.message && <Error message={errors.message} />}

        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="destructive"
            onClick={createNewLink}
            disabled={loading}
          >
            {loading ? (
              <BeatLoader size={10} color="white" />
            ) : (
              "Create"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
