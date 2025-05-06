import Image from "next/image";
type BoardProps = {
  projectId : string | null;
  projectName : string | null;
  projectDesc : string | null;
};

const Summary = ({ projectName }: BoardProps) => {
  return (
    <div className="summary-b p-6 overflow-y-auto">
      {/* 화면 크기에 따라 레이아웃 변경 */}
      <div className="m-3 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 개별 블록 */}
        <div className="summary-top p-4 text-center rounded-lg">
          <div className="flex items-center gap-2 ml-1">
            <Image className="summaryImages" src="/checkLogo.jpg" alt="check" width={60} height={60} />
            <h1 className="font-bold">0개 완료함</h1>
          </div>
        </div>
        <div className="summary-top p-4 text-center rounded-lg">
          <div className="flex items-center gap-2 ml-1">
            <Image className="summaryImages" src="/updateLogo.jpg" alt="check" width={60} height={60} />
            <h1 className="font-bold">0개 업데이트함</h1>
          </div>
        </div>
        <div className="summary-top p-4 text-center rounded-lg">
          <div className="flex items-center gap-2 ml-1">
            <Image className="summaryImages" src="/madeLogo.jpg" alt="check" width={60} height={60} />
            <h1 className="font-bold">0개 만듦</h1>
          </div>
        </div>
        <div className="summary-top p-4 text-center rounded-lg">
          <div className="flex items-center gap-2 ml-1">
            <Image className="summaryImages" src="/deadlineLogo.jpg" alt="check" width={60} height={60} />
            <h1 className="font-bold">0개 마감 예정</h1>
          </div>
        </div>
      </div>
      <div className="h-150 m-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="summary-middle p-4 text-center rounded-lg">
          <div className="flex items-center gap-2 ml-1">
            <h1 className="font-bold">상태 개요</h1>
          </div>
        </div>
        <div className="summary-middle p-4 text-center rounded-lg">
          <div className="flex items-center gap-2 ml-1">
            <h1 className="font-bold">최근 활동</h1>
          </div>
        </div>
        <div className="summary-middle p-4 text-center rounded-lg">
          <div className="flex items-center gap-2 ml-1">
            <h1 className="font-bold">업무 유형</h1>
          </div>
        </div>
        <div className="summary-middle p-4 text-center rounded-lg">
          <div className="flex items-center gap-2 ml-1">
            <h1 className="font-bold">팀 워크로드</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;