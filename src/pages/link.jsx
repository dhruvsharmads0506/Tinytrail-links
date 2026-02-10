import DeviceStats from "@/components/device-stats";
import Location from "@/components/location-stats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UrlState } from "@/context";
import { getClicksForUrl } from "@/db/apiClicks";
import { deleteUrl, getUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import { Copy, Download, LinkIcon, Trash } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader, BeatLoader } from "react-spinners";

/* ✅ FIXED: dynamic domain */
const BASE_URL = window.location.origin;

const LinkPage = () => {
  const navigate = useNavigate();
  const { user } = UrlState();
  const { id } = useParams();

  const { loading, data: url, fn, error } = useFetch(getUrl, {
    id,
    user_id: user?.id,
  });

  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = useFetch(getClicksForUrl, id);

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, id);

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!error && loading === false) {
      fnStats();
    }
  }, [loading, error]);

  useEffect(() => {
    if (error) {
      navigate("/dashboard");
    }
  }, [error, navigate]);

  const link = url?.custom_url || url?.short_url;
  const shortUrl = `${BASE_URL}/${link}`;

  const downloadImage = () => {
    const anchor = document.createElement("a");
    anchor.href = url?.qr;
    anchor.download = url?.title || "qr-code";
    anchor.click();
  };

  return (
    <>
      {(loading || loadingStats) && (
        <BarLoader width="100%" color="#36d7b7" className="mb-6" />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT PANEL */}
        <Card className="lg:col-span-4 lg:sticky lg:top-6 h-fit">
          <CardHeader className="space-y-3">
            <CardTitle className="text-2xl font-bold break-word">
              {url?.title}
            </CardTitle>

            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-medium hover:underline break-all"
            >
              {shortUrl}
            </a>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex gap-2 text-sm text-muted-foreground break-all">
              <LinkIcon size={16} className="mt-0.5" />
              <a href={url?.original_url} target="_blank" rel="noopener noreferrer">
                {url?.original_url}
              </a>
            </div>

            <p className="text-xs text-muted-foreground">
              Created on{" "}
              {url?.created_at && new Date(url.created_at).toLocaleString()}
            </p>

            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                onClick={() => navigator.clipboard.writeText(shortUrl)}
                className="flex items-center gap-2"
              >
                <Copy size={16} />
                Copy
              </Button>

              <Button
                variant="outline"
                onClick={downloadImage}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                QR
              </Button>

              <Button
                variant="destructive"
                disabled={loadingDelete}
                onClick={() => fnDelete().then(() => navigate("/dashboard"))}
                className="flex items-center gap-2"
              >
                {loadingDelete ? (
                  <BeatLoader size={5} color="white" />
                ) : (
                  <>
                    <Trash size={16} />
                    Delete
                  </>
                )}
              </Button>
            </div>

            <div>
              <p className="text-sm font-semibold mb-2">QR Code</p>
              <div className="rounded-xl border bg-muted p-4 flex justify-center">
                <img src={url?.qr} alt="QR Code" className="w-40 h-40 object-contain" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT PANEL */}
        <Card className="lg:col-span-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Analytics Overview
            </CardTitle>
          </CardHeader>

          {stats && stats.length ? (
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Total Clicks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{stats.length}</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Location Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <Location stats={stats} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Device Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <DeviceStats stats={stats} />
                </CardContent>
              </Card>
            </CardContent>
          ) : (
            <CardContent className="py-20 text-center text-muted-foreground">
              {loadingStats
                ? "Loading analytics..."
                : "No analytics data available yet"}
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
};

export default LinkPage;
