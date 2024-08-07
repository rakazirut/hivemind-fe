import { Link } from "react-router-dom";
import CreateDropdown from "./CreateDropdown";
import UserDropdown from "./UserDropdown";

const Navbar = () => {
  return (
    <nav className="bg-black text-white">
      <ul className="flex justify-between">
        <li className="p-2">
          <Link to="/">Hivemind</Link>
        </li>
        <div className="flex">
          <li className="p-2">
            {localStorage.accessToken ? <CreateDropdown /> : null}
          </li>
          <li className="p-2">
            {localStorage.accessToken ? <UserDropdown /> : null}
          </li>
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
