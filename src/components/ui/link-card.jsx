/* eslint-disable react/prop-types */
import { Copy, Download, LinkIcon, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import useFetch from "@/hooks/use-fetch";
import { deleteUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";

/* ✅ FIXED: Auto detect current domain */
const BASE_URL = window.location.origin;

const LinkCard = ({ url = {}, fetchUrls }) => {
  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title || "qr-code";

    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const { loading: loadingDelete, fn: fnDelete } = useFetch(
    deleteUrl,
    url.id
  );

  const shortCode = url?.custom_url || url?.short_url;

  /* ✅ Now link automatically matches current site domain */
  const shortUrl = `${BASE_URL}/${shortCode}`;

  return (
    <div className="flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg">
      <img
        src={url?.qr}
        className="h-32 object-contain ring ring-blue-500 self-start"
        alt="TinyTRaIL QR Code"
      />

      <Link to={`/link/${url?.id}`} className="flex flex-col flex-1">
        <span className="text-3xl font-extrabold hover:underline cursor-pointer">
          {url?.title}
        </span>

        <span className="text-2xl text-blue-400 font-bold hover:underline cursor-pointer break-all">
          {shortUrl}
        </span>

        <span className="flex items-center gap-1 hover:underline cursor-pointer break-all">
          <LinkIcon className="p-1" />
          {url?.original_url}
        </span>

        <span className="flex items-end font-extralight text-sm flex-1">
          {url?.created_at && new Date(url.created_at).toLocaleString()}
        </span>
      </Link>

      <div className="flex gap-2">
        <Button
          variant="ghost"
          onClick={() => navigator.clipboard.writeText(shortUrl)}
        >
          <Copy />
        </Button>

        <Button variant="ghost" onClick={downloadImage}>
          <Download />
        </Button>

        <Button
          variant="ghost"
          onClick={() => fnDelete().then(() => fetchUrls())}
          disabled={loadingDelete}
        >
          {loadingDelete ? (
            <BeatLoader size={5} color="white" />
          ) : (
            <Trash />
          )}
        </Button>
      </div>
    </div>
  );
};

export default LinkCard;
