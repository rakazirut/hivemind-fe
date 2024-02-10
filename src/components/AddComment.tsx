import { useRef } from 'react';

const AddComment = () => {
  const commentRef = useRef<HTMLTextAreaElement>(null);
  return (
    <>
    <div className="flex justify-center">
      <textarea
        className="w-4/5 border border-black rounded-md p-3 md:w-2/5"
        name="writeComment"
        rows={4}
        ref={commentRef}
      ></textarea>
      </div>
      <div>
      <button
        className="w-4/5 justify-center md:w-auto rounded-md flex p-3 mx-auto my-4 bg-black text-white hover:cursor-pointer hover:bg-gray-300 hover:text-black"
      >
        Add Comment
      </button>
    </div>
    </>
  );
};

export default AddComment;
