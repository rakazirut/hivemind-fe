import { useState } from "react";
import { useParams } from "react-router-dom";
import useIso from "../hooks/useIso";
import useVote from "../hooks/useVote";
import { useMutation } from "@tanstack/react-query";
import { TComment } from "../types";
import ReplyContainer from "./ReplyContainer";

const CommentContainer = (props: any) => {
  // URL Variables
  const baseURL = import.meta.env.VITE_BASEURL;
  const upvoteURL = baseURL + "/comment/uuid/" + props.Uuid + "/add-upvote";
  const downvoteURL = baseURL + "/comment/uuid/" + props.Uuid + "/add-downvote";
  const params = useParams();

  // State
  const [upvoteCount, setUpvoteCount] = useState<number>(props.Upvote);
  const [downvoteCount, setDownvoteCount] = useState<number>(props.Downvote);
  const [replyTextareaShow, setReplyTextareaShow] = useState<boolean>(false)
  const [replyButtonShow, setReplyButtonShow] = useState<boolean>(false)
  const [textareaValue, setTextareaValue] = useState<string>("");
  const [replyButtonText, setReplyButtonText] = useState<string>("Add Reply");
  const [disabled, setDisabled] = useState<boolean>(false);

  // Initial state is received from parent component via GET.  Setter function calls useState and increments the value by 1.
  const upvoteSetter = () => setUpvoteCount((prev: any) => prev + 1);
  const downvoteSetter = () => setDownvoteCount((prev: any) => prev + 1);

  // ----- Voting Start ----- //
  // Vote Hooks.  Params are the PATCH URL and the setter function
  const { mutate: upvote } = useVote(upvoteURL, upvoteSetter);
  const { mutate: downvote } = useVote(downvoteURL, downvoteSetter);

  // Vote Click Function.  Pass in the mutution to call
  function vote(fn: any) {
    fn();
  }
  // ----- Voting End ----- //

  // ----- Reply Start ----- //
  // Text Area Value Handler
  function textareaHandler(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setTextareaValue(e.target.value);
  }

  // Add Reply Toggle Control
  function replyToggle() {
    setReplyTextareaShow(!replyTextareaShow)
    setReplyButtonShow(!replyButtonShow)
  }

// POST Reply
function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setDisabled(true);
  const commentObject: any = {
    message: textareaValue,
  };
  mutate(commentObject);
}
const { mutate } = useMutation({
  mutationFn: postReply,
});

async function postReply(body: string) {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await fetch(
      baseURL + "/content/uuid/" + params.uuid + "/comment/" + props.Uuid + "/reply",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }
    setReplyButtonText("Reply Added!");
    setDisabled(true);
    setTimeout(() => {
      setReplyButtonText("Add Reply");
      setTextareaValue("");
      setDisabled(false);
      props.refetch();
    }, 1500);
  } catch (error) {
    console.error(error);
    setDisabled(false)
  }
}


  // ----- Reply End ----- //

  return (
    <div
      className="p-3 mx-auto my-4 max-w-xl bg-gray-300 xs:rounded-none sm:rounded-md"
      id={props.Id}
    >
      <div className="flex gap-2">
        <div className="w-full">
          {/* User & Time Container */}
          <div className="flex w-max p-2 rounded-md text-sm">
            <p>
              {props.Author} | {useIso(props.Created.Time)}
            </p>
            <p></p>
          </div>
          {/* Comment Body Container */}
          <div className="p-2 rounded-md flex-none max-w-md">
            <p>{props.Deleted === true ? "Comment Deleted" : props.Message}</p>
          </div>
          {/* Horizontal Vote Container */}
          <div className="flex gap-2">
            <div className="flex w-max p-2 justify-evenly rounded-md text-sm hover:bg-gray-200">
              <button onClick={() => vote(upvote)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                </svg>
              </button>
              <p className="px-2">{upvoteCount}</p>
              <button onClick={() => vote(downvote)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M15.73 5.5h1.035A7.465 7.465 0 0 1 18 9.625a7.465 7.465 0 0 1-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 0 1-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.499 4.499 0 0 0-.322 1.672v.633A.75.75 0 0 1 9 22a2.25 2.25 0 0 1-2.25-2.25c0-1.152.26-2.243.723-3.218.266-.558-.107-1.282-.725-1.282H3.622c-1.026 0-1.945-.694-2.054-1.715A12.137 12.137 0 0 1 1.5 12.25c0-2.848.992-5.464 2.649-7.521C4.537 4.247 5.136 4 5.754 4H9.77a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23ZM21.669 14.023c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.958 8.958 0 0 1-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227Z" />
                </svg>
              </button>
              <p className="px-2">{downvoteCount}</p>
            </div>
            {/* Comment Container */}
            <button
              className="flex w-max p-2 justify-evenly rounded-md text-sm hover:bg-gray-200"
              onClick={replyToggle}
            ><p className="pr-1">{props.Replies.length}</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          {/* Reply Input Start */}
          <div className="mx-auto bg-gray-300 xs:rounded-none sm:rounded-md">
            {replyTextareaShow && <textarea
              className={"w-full border border-black rounded-md p-3 md:mx-auto my-2 max-w-xl resize-none"}
              name="reply"
              rows={3}
              minLength={1}
              maxLength={2048}
              placeholder="Type Reply"
              value={textareaValue}
              disabled={disabled}
              onChange={textareaHandler}
            ></textarea>}
            {replyButtonShow && <button
              className={"w-4/5 justify-center md:w-auto rounded-md flex p-3 mx-auto max-w-xl bg-black text-white hover:cursor-pointer hover:bg-gray-400 hover:text-black"}
              disabled={disabled}
              onClick={handleSubmit}
            >
              {replyButtonText}
            </button>}
          </div>
          <p className="text-xs"></p>
        </div>
      </div>
      {props.Replies.map((item: TComment) => (
        <ReplyContainer key={item.Id} {...item} />
      ))}
    </div>
  );
};

export default CommentContainer;
