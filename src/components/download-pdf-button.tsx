declare const html2pdf: any

export default function DownloadPdfButton({ elementId }: { elementId: string }) {
  const handleDownloadPDF = () => {
    // 获取要转换为 PDF 的元素
    const element = document.getElementById(elementId)
    console.log(element)
    // 如果元素不存在，直接返回
    if (!element) return

    // 创建 PDF 配置
    const opt = {
      margin: 1,
      filename: '陈金伙的简历.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' },
    }

    // 生成 PDF 并下载
    html2pdf()
      .from(element)
      .set(opt)
      .save()
      .catch((error: unknown) => {
        console.error('PDF 生成失败:', error)
        alert('PDF 生成失败，请重试')
      })
  }
  
  return (
    <button 
      onClick={handleDownloadPDF}
      className=" dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 p-2 rounded-md shadow transition-colors duration-200 flex items-center justify-center"
      aria-label="下载简历 PDF"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleDownloadPDF()}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
    </button>
  )
}
