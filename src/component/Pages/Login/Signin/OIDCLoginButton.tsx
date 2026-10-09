import { LoginRounded } from "@mui/icons-material";
import { Avatar, Button } from "@mui/material";
import { useCallback } from "react";
import { useAppSelector } from "../../../../redux/hooks.ts";

export const oidcStartUrl = (redirect?: string | null) => {
  const query = new URLSearchParams();
  if (redirect) {
    query.set("redirect", redirect);
  }
  const search = query.toString();
  return `/api/v4/session/oidc${search ? `?${search}` : ""}`;
};

const OIDCLoginButton = ({ redirect }: { redirect?: string | null }) => {
  const oidc = useAppSelector((state) => state.siteConfig.login.config.oidc);
  const startLogin = useCallback(() => {
    window.location.assign(oidcStartUrl(redirect));
  }, [redirect]);

  if (!oidc?.enabled) {
    return null;
  }

  return (
    <Button
      fullWidth
      variant="outlined"
      onClick={startLogin}
      startIcon={
        oidc.logo ? <Avatar src={oidc.logo} alt="" sx={{ width: 22, height: 22 }} /> : <LoginRounded fontSize="small" />
      }
    >
      {oidc.display_name || "OpenID Connect"}
    </Button>
  );
};

export default OIDCLoginButton;
