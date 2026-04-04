import useSWR from 'swr';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const fetcher = async (url) => {
  const res = await axios.get(url);
  return res.data;
};

export const useSync = (gstin) => {
  const { data, error, isLoading, mutate } = useSWR(
    gstin ? `${API_BASE_URL}/score/${gstin}` : null,
    fetcher,
    {
      refreshInterval: 30000, // 30s as per requirements
      revalidateOnFocus: true,
    }
  );

  const { data: sentinelData } = useSWR(
    gstin ? `${API_BASE_URL}/sentinel/${gstin}` : null,
    fetcher,
    {
      refreshInterval: 30000,
    }
  );

  return {
    dashboardData: data,
    sentinelData,
    isLoading,
    isError: error,
    mutate,
  };
};
