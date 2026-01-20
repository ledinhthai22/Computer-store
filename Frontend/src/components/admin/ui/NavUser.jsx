import { User2} from 'lucide-react';

const NavUserMenu = () => {
  return (
    <div className="flex items-center space-x-3">
        <div className="text-right hidden md:block">
          <p className="text-sm text-white">Quản trị viên</p>
        </div>
        <div className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all border-cyan-500/50 hover:border-cyan-400 cursor-pointer`}>
          <User2 className="w-full h-full object-cover bg-slate-700 p-1" />
        </div>
      </div>
  );
};

export default NavUserMenu;