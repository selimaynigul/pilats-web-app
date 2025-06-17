import { ItemData } from "types/types";
export const mapToItemData = (raw: any): ItemData => {
  return {
    id: raw?.id?.toString() ?? "",
    isActive: raw?.passive ?? null,
    imageUrl: raw?.imageUrl ?? null,

    title: raw?.ucGetResponse
      ? `${raw.ucGetResponse.name ?? ""} ${raw.ucGetResponse.surname ?? ""}`.trim()
      : raw?.companyName,
    subtitle: (raw?.jobName || raw?.location) ?? null,

    detailUrl: raw?.detailUrl && raw?.id ? `${raw.detailUrl}/${raw.id}` : null,

    company: {
      id: raw?.companyId?.toString() ?? null,
      name: raw?.companyName ?? null,
      location: raw?.location ?? null,
      branch: raw?.branchName ?? null,
    },

    contact: {
      email: raw?.email ?? null,
      phone: raw?.ucGetResponse?.telNo1 ?? null,
      whatsapp: raw?.ucGetResponse?.telNo1 ?? null,
    },
  };
};

export const isMobile = () => {
  if (typeof navigator === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};
