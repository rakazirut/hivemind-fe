import { useMutation } from "@tanstack/react-query";

const useVote = (url: string, setter: any) => {
  const token = localStorage.getItem("accessToken");
  const castVote = async () => {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "*/*",
      },
    });
    if (!response.ok) {
      throw new Error("Failed");
    }
    return await response.json();
  };

  const { mutate } = useMutation({
    mutationFn: castVote,
    onMutate: setter,
  });

  return { mutate };
};

export default useVote;
