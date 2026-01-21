import axiosClient from "./axiosClient";

export const statisticsService = {
  getSales: () =>
    axiosClient.get("/admin/statistics/sales-overview").then((res) => res.data),
};
