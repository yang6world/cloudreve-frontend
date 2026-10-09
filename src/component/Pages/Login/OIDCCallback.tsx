import { LoginRounded } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { exchangeOIDCLogin } from "../../../api/api.ts";
import { useAppDispatch } from "../../../redux/hooks.ts";
import { refreshUserSession } from "../../../redux/thunks/session.ts";
import PageTitle from "../../../router/PageTitle.tsx";
import { useQuery } from "../../../util";
import FacebookCircularProgress from "../../Common/CircularProgress.tsx";

const OIDCCallback = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const query = useQuery();
  const [error, setError] = useState(query.has("error") ? t("login.oidcFailed") : "");
  const exchangeStarted = useRef(false);
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  const ticket = fragment.get("ticket");
  const redirect = fragment.get("redirect");

  useEffect(() => {
    if (exchangeStarted.current || error) {
      return;
    }
    if (!ticket) {
      setError(t("login.oidcMissingTicket"));
      return;
    }
    exchangeStarted.current = true;
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);

    dispatch(exchangeOIDCLogin(ticket))
      .then((session) => dispatch(refreshUserSession(session, redirect)))
      .catch((reason: Error) => setError(reason.message));
  }, [dispatch, error, redirect, t, ticket]);

  return (
    <Box>
      <PageTitle title={t("login.oidcSigningIn")} />
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 7, gap: 2 }}>
        {error ? (
          <>
            <Typography color="error" align="center">
              {error}
            </Typography>
            <Button startIcon={<LoginRounded />} onClick={() => navigate("/session")}>
              {t("login.backToSingIn")}
            </Button>
          </>
        ) : (
          <>
            <FacebookCircularProgress />
            <Typography color="text.secondary">{t("login.oidcSigningIn")}</Typography>
          </>
        )}
      </Box>
    </Box>
  );
};

export default OIDCCallback;
