import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { hasRole } from "utils/permissionUtils";
import { companyService, branchService } from "services";
import { useLanguage } from "hooks";

export interface CompanyState {
  companyName: string;
  id: string | null; // seçilen şirket veya şube ID’si
  branchParam?: string; // URL’den gelen branch ID
  companyParam?: string; // URL’den gelen company ID
  branchName?: string; // okunabilir şube adı
  companyId?: string; // şube ID’si seçiliyse ait olduğu şirket ID’si
}

export default function useFilter() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  /* ---------- 0)  Boş (State Template) -------------------- */
  const emptyCompany: CompanyState = useMemo(
    () => ({
      companyName: hasRole(["COMPANY_ADMIN"])
        ? t.selectBranch
        : t.selectCompany,
      id: null,
      branchParam: undefined,
      companyParam: undefined,
      branchName: undefined,
      companyId: undefined,
    }),
    [t]
  );

  /* ---------- 1)  İlk Yük (URL’den okuma) ----------------- */
  const [company, setCompanyRaw] = useState<CompanyState>(() => {
    const urlCompany = searchParams.get("company");
    const urlBranch = searchParams.get("branch");

    if (!urlCompany) return { ...emptyCompany };

    return {
      companyName: "Loading",
      id: urlCompany,
      branchParam: urlBranch ?? undefined,
      companyParam: urlCompany,
      branchName: undefined,
      companyId: undefined,
    };
  });

  /* ---------- 2)  Dışa açılan güvenli setter -------------- */
  const setCompany = useCallback(
    (value: CompanyState | null) => {
      setCompanyRaw(value === null ? { ...emptyCompany } : value);
    },
    [emptyCompany]
  );

  /* ---------- 3)  STATE → URL senk. ----------------------- */
  useEffect(() => {
    const params: Record<string, string> = {};

    const companyId = company.companyId ?? company.id ?? undefined;
    if (companyId) params.company = companyId;

    const branchId =
      company.branchParam ??
      (company.branchName ? (company.id ?? undefined) : undefined);
    if (branchId) params.branch = branchId;

    // {} verilirse query string silinir
    setSearchParams(params);
  }, [
    company.id,
    company.companyId,
    company.branchParam,
    company.branchName,
    setSearchParams,
  ]);

  /* ---------- 4)  ID → İsim Fetch ------------------------ */
  useEffect(() => {
    if (!company.id && !company.branchParam) return; // seçim yok

    (async () => {
      let companyName = company.companyName || t.selectCompany;
      let branchName = "";

      // Şirket adı
      if (company.companyParam) {
        try {
          const res = await companyService.search({ id: company.companyParam });
          companyName = res?.data?.[0]?.companyName ?? companyName;
        } catch (err) {
          console.error("Company fetch error", err);
        }
      }

      // Şube adı
      if (company.companyParam && company.branchParam) {
        try {
          const res = await branchService.search({ id: company.branchParam });
          branchName = res?.data?.[0]?.branchName ?? "";
        } catch (err) {
          console.error("Branch fetch error", err);
        }
      }

      setCompanyRaw((prev) => ({
        ...prev,
        companyName: branchName
          ? `${companyName} - ${branchName}`
          : companyName,
      }));
    })();
  }, [company.companyParam, company.branchParam, t]);

  /* ---------- 5)  Dışa Aktarım ---------------------------- */
  return { company, setCompany };
}
