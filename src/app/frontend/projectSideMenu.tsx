import Link from "next/link";

type SidebarProps = {
  active: string;  
  setActive: (value: string) => void;  
};

const Sidebar = ({ active, setActive }: SidebarProps) => {
  return (
    <div className="w-60 min-w-45 bg-white text-gray-900 p-6 flex flex-col gap-4 border-r-2 border-gray-300 overflow-y-auto max-h-none">
        <div className="m-3">
            <h2 className="font-bold mb-6">계획</h2>

            <nav className="flex flex-col gap-3">
                <Link href="/" onClick={() => setActive("summary")}>
                <div className={`flex items-center gap-3 rounded-2xl cursor-pointer hover:bg-blue-400 transition ${active === "summary" ? "border-2 border-blue-400" : ""}`}>
                    <span className="m-2">🌐요약</span>
                </div>
                </Link>

                <Link href="/" onClick={() => setActive("timeline")}>
                <div className={`flex items-center gap-3 rounded-2xl cursor-pointer hover:bg-blue-400 transition ${active === "timeline" ? "border-2 border-blue-400" : ""}`}>
                    <span className="m-2">타임라인</span>
                </div>
                </Link>

                <Link href="/" onClick={() => setActive("board")}>
                <div className={`flex items-center gap-3 rounded-2xl cursor-pointer hover:bg-blue-400 transition ${active === "board" ? "border-2 border-blue-400" : ""}`}>
                    <span className="m-2">보드</span>
                </div>
                </Link>
            </nav>
        </div>
        
    </div>
  );
};

export default Sidebar;