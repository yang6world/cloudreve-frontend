import { ExpandMoreRounded } from "@mui/icons-material";
import { Accordion, AccordionDetails, Avatar, Box, FormControl, FormControlLabel, Stack, Switch } from "@mui/material";
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import { styled } from "@mui/material/styles";
import { useContext } from "react";
import { Trans, useTranslation } from "react-i18next";
import { isTrueVal } from "../../../../session/utils.ts";
import { DenseFilledTextField } from "../../../Common/StyledComponents.tsx";
import SettingForm from "../../../Pages/Setting/SettingForm.tsx";
import { NoMarginHelperText } from "../Settings.tsx";
import { SettingContext } from "../SettingWrapper.tsx";

export const AccordionSummary = styled((props: AccordionSummaryProps) => <MuiAccordionSummary {...props} />)(
  ({ theme }) => ({
    fontSize: theme.typography.body2.fontSize,
    paddingLeft: theme.spacing(4),
    "& .MuiFormControlLabel-label": {
      fontSize: theme.typography.body2.fontSize,
    },
    "& .MuiCheckbox-root": {
      marginRight: theme.spacing(2),
    },
  }),
);

export const StyledAccordion = styled(Accordion)(({ theme }) => ({
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
  "&::before": {
    display: "none",
  },
}));

const SSOSettings = () => {
  const { t } = useTranslation("dashboard");
  const { values, setSettings } = useContext(SettingContext);
  const enabled = isTrueVal(values.oidc_enabled);
  const callbackUrl = `${window.location.origin}/api/v4/session/oidc/callback`;
  const clientSecretConfigured = values.oidc_client_secret === "********";
  const clientSecret = clientSecretConfigured ? "" : values.oidc_client_secret ?? "";

  return (
    <StyledAccordion defaultExpanded={enabled} disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreRounded />}>
        <FormControlLabel
          onClick={(event) => event.stopPropagation()}
          control={
            <Switch
              size="small"
              checked={enabled}
              onChange={(event) => setSettings({ oidc_enabled: event.target.checked ? "1" : "0" })}
            />
          }
          label={t("settings.oidc")}
        />
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={3}>
          <NoMarginHelperText>
            <Trans
              i18nKey="settings.oidcDes"
              ns="dashboard"
              values={{ url: callbackUrl }}
              components={{ code: <code /> }}
            />
          </NoMarginHelperText>
          <SettingForm title={t("settings.oidcIssuer")} noContainer>
            <FormControl fullWidth>
              <DenseFilledTextField
                value={values.oidc_issuer ?? ""}
                onChange={(event) => setSettings({ oidc_issuer: event.target.value })}
                placeholder="https://idp.example.com"
                required={enabled}
                type="url"
              />
              <NoMarginHelperText>{t("settings.oidcIssuerDes")}</NoMarginHelperText>
            </FormControl>
          </SettingForm>
          <SettingForm title={t("settings.clientID")} noContainer>
            <FormControl fullWidth>
              <DenseFilledTextField
                value={values.oidc_client_id ?? ""}
                onChange={(event) => setSettings({ oidc_client_id: event.target.value })}
                required={enabled}
              />
              <NoMarginHelperText>{t("settings.clientIDDes")}</NoMarginHelperText>
            </FormControl>
          </SettingForm>
          <SettingForm title={t("settings.clientSecret")} noContainer>
            <FormControl fullWidth>
              <DenseFilledTextField
                value={clientSecret}
                onChange={(event) => setSettings({ oidc_client_secret: event.target.value })}
                placeholder={clientSecretConfigured ? t("settings.clientSecretConfigured") : undefined}
                required={enabled && !clientSecretConfigured}
                type="password"
                autoComplete="new-password"
              />
              <NoMarginHelperText>{t("settings.clientSecretDes")}</NoMarginHelperText>
            </FormControl>
          </SettingForm>
          <SettingForm title={t("settings.oidcScopes")} noContainer>
            <FormControl fullWidth>
              <DenseFilledTextField
                value={values.oidc_scopes ?? "openid profile email"}
                onChange={(event) => setSettings({ oidc_scopes: event.target.value })}
                placeholder="openid profile email"
                required={enabled}
              />
              <NoMarginHelperText>{t("settings.oidcScopesDes")}</NoMarginHelperText>
            </FormControl>
          </SettingForm>
          <SettingForm title={t("settings.oidcDisplayName")} noContainer>
            <FormControl fullWidth>
              <DenseFilledTextField
                value={values.oidc_display_name ?? "OpenID Connect"}
                onChange={(event) => setSettings({ oidc_display_name: event.target.value })}
                placeholder="OpenID Connect"
                required={enabled}
              />
            </FormControl>
          </SettingForm>
          <SettingForm title={t("settings.oidcLogo")} noContainer>
            <FormControl fullWidth>
              <DenseFilledTextField
                value={values.oidc_logo ?? ""}
                onChange={(event) => setSettings({ oidc_logo: event.target.value })}
                placeholder="https://idp.example.com/logo.png"
              />
              {values.oidc_logo ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                  <Avatar src={values.oidc_logo} alt={values.oidc_display_name} sx={{ width: 28, height: 28 }} />
                  <NoMarginHelperText>{t("settings.oidcLogoPreview")}</NoMarginHelperText>
                </Box>
              ) : null}
            </FormControl>
          </SettingForm>
          <FormControl fullWidth>
            <FormControlLabel
              control={
                <Switch
                  checked={isTrueVal(values.oidc_require_verified_email ?? "1")}
                  onChange={(event) => setSettings({ oidc_require_verified_email: event.target.checked ? "1" : "0" })}
                />
              }
              label={t("settings.oidcRequireVerifiedEmail")}
            />
            <NoMarginHelperText>{t("settings.oidcRequireVerifiedEmailDes")}</NoMarginHelperText>
          </FormControl>
          <FormControl fullWidth>
            <FormControlLabel
              control={
                <Switch
                  checked={isTrueVal(values.oidc_only_login)}
                  onChange={(event) => setSettings({ oidc_only_login: event.target.checked ? "1" : "0" })}
                />
              }
              label={t("settings.oidcOnlyLogin")}
            />
            <NoMarginHelperText>{t("settings.oidcOnlyLoginDes")}</NoMarginHelperText>
          </FormControl>
        </Stack>
      </AccordionDetails>
    </StyledAccordion>
  );
};

export default SSOSettings;
