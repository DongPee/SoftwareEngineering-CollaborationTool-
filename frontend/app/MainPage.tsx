import { motion } from "framer-motion";
import Link from "next/link";
const MainPage = () => {
  return (
    <div className="mainPage min-h-screen font-sans">
      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-6">
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          협업을 더 빠르고 간단하게.
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl max-w-xl mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          당신의 팀워크를 위한 완벽한 협업 툴.
        </motion.p>
        <Link href="projectList">
          <motion.div
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition cursor-pointer text-center"
            whileHover={{ scale: 1.3 }}
          >
            <p className="ml-5 mr-5">시작하기</p>
          </motion.div>
        </Link>
      </section>

      <section id="features" className="py-20 px-6">
        <h2 className="text-3xl font-semibold text-center mb-12">주요 기능</h2>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3">
          {[
            { title: "실시간 채팅", desc: "팀원과의 빠른 소통" },
            { title: "업무 보드", desc: "할 일과 진행 상황을 한눈에" },
            { title: "알림 시스템", desc: "중요한 변화를 놓치지 마세요" },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="mainPage-function p-6 rounded-lg shadow-md hover:shadow-xl transition"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default MainPage;