import Image from "next/image";

const Summary = () => {
  return (
    <div className="summary-b p-6">
      {/* 화면 크기에 따라 레이아웃 변경 */}
      <div className="m-3 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 개별 블록 */}
        <div className="summary-top p-4 text-center rounded-lg">
          <div className="flex items-center gap-2 ml-1">
            <Image src="/checkLogo.jpg" alt="check" width={60} height={60} />
            <h1 className="font-bold">0개 완료함</h1>
          </div>
        </div>
        <div className="summary-top p-4 text-center rounded-lg">
          <div className="flex items-center gap-2 ml-1">
            <Image src="/updateLogo.jpg" alt="check" width={60} height={60} />
            <h1 className="font-bold">0개 업데이트함</h1>
          </div>
        </div>
        <div className="summary-top p-4 text-center rounded-lg">
          <div className="flex items-center gap-2 ml-1">
            <Image src="/madeLogo.jpg" alt="check" width={60} height={60} />
            <h1 className="font-bold">0개 만듦</h1>
          </div>
        </div>
        <div className="summary-top p-4 text-center rounded-lg">
          <div className="flex items-center gap-2 ml-1">
            <Image src="/deadlineLogo.jpg" alt="check" width={60} height={60} />
            <h1 className="font-bold">0개 마감 예정</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;