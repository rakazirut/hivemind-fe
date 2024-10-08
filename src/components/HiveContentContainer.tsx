// SPDX-License-Identifier: Apache-2.0

import { Link } from "react-router-dom";
import getIso from "../utils/tokenTools/getIso";
import useGetVotes from "../hooks/useGetVotes";
import { TContent } from "../types";
import CommentIcon from "../assets/CommentIcon";
import VoteContainer from "./ContentVoteContainer";

const HiveContentContainer = ({ item }: { item: TContent }) => {
  const baseURL = import.meta.env.VITE_BASEURL;
  const voteURL = baseURL + "/content/uuid/" + item.Uuid;
  const { data, isLoading, isFetching, isError } = useGetVotes(
    baseURL + "/content/votes"
  );
  return (
    <div
      className="p-3 mx-auto my-2 max-w-xl w-full bg-gray-300 xs:rounded-none sm:rounded-md"
      id={item.Id}
    >
      <div className="flex gap-2">
        {/* Vertical Vote Container */}
        <div className="hidden md:flex flex-col p-2 h-max rounded-md text-sm">
          {isLoading || isFetching ? (
            "..."
          ) : isError ? (
            "Error"
          ) : (
            <VoteContainer {...item} voteData={data} voteURL={voteURL} />
          )}
        </div>
        <div>
          {/* User & Time Container */}
          <div className="flex w-max p-2 rounded-md text-sm">
            <p>
              {item.Hive} | {getIso(item.Created.Time)}
            </p>
          </div>
          {/* Content Title Container */}
          <Link to={`/content/uuid/${item.Uuid}`}>
            <div className="p-2 mt-2 rounded-md max-w-md hover:cursor-pointer hover:bg-gray-200">
              <p className="text-xl">{item.Title}</p>
            </div>
          </Link>
          {/* Content Body Container */}
          <div className="p-2 rounded-md flex-none w-full max-w-md md:max-w-md">
            <p className="truncate ...">{item.Message}</p>
          </div>
          {/* Horizontal Vote Container */}
          <div className="flex gap-2 items-center">
            <div className="flex w-max p-2 justify-evenly rounded-md text-sm md:hidden">
              {isLoading || isFetching ? (
                "..."
              ) : isError ? (
                "Error"
              ) : (
                <VoteContainer {...item} voteData={data} voteURL={voteURL} />
              )}
            </div>
            {/* Comment Container */}
            <div className="flex w-max p-2 justify-evenly rounded-md text-sm">
              <CommentIcon />
              <p className="px-1">{item.CommentCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiveContentContainer;
