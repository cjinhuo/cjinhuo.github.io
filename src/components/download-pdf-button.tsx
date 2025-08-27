import { useState } from 'react'
import type { JSX } from 'react'

interface Props {
  elementId: string
}

export default function DownloadPdfButton({ elementId }: Props): JSX.Element {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async (): Promise<void> => {
    const element = document.getElementById(elementId)
    if (!element) return

    setIsGenerating(true)

    // 添加PDF优化类名
    element.classList.add('pdf-optimized')
    document.body.classList.add('pdf-generating')

    // 等待样式应用
    await new Promise(resolve => setTimeout(resolve, 100))

    const opt = {
      margin: [10, 10, 10, 10],
      filename: '陈金伙的简历.pdf',
      image: { 
        type: 'jpeg', 
        quality: 0.98,
        crossOrigin: 'anonymous'
      },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        removeContainer: true,
        onclone: (clonedDoc: Document) => {
          // 在克隆的文档中移除所有边框
          const clonedElement = clonedDoc.getElementById(elementId)
          if (clonedElement) {
            // 移除边框类
            const borderElements = clonedElement.querySelectorAll('.border-b, .border-l-4, .border')
            borderElements.forEach(el => {
              el.classList.remove('border-b', 'border-l-4', 'border', 'border-gray-200', 'border-gray-700')
            })

            // 优化时间轴点的样式
            const timelinePoints = clonedElement.querySelectorAll('.absolute.-left-2')
            timelinePoints.forEach(point => {
              (point as HTMLElement).style.display = 'none'
            })

            // 移除左边框，改为左侧内边距
            const leftBorderElements = clonedElement.querySelectorAll('.border-l-4')
            leftBorderElements.forEach(el => {
              el.classList.remove('border-l-4')
              el.classList.add('pl-4')
            })
          }
        }
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { 
        mode: ['avoid-all', 'css', 'legacy'],
        before: '.page-break-before',
        after: '.page-break-after'
      }
    }

    try {
      // 生成 PDF 并下载
      await (window as any).html2pdf()
        .from(element)
        .set(opt)
        .save()
    } catch (error) {
      console.error('PDF生成失败:', error)
    } finally {
      // 移除PDF优化类名
      element.classList.remove('pdf-optimized')
      document.body.classList.remove('pdf-generating')
      setIsGenerating(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm"
    >
      {isGenerating ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          <span>生成中...</span>
        </>
      ) : (
        <>
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          <span>下载PDF</span>
        </>
      )}
    </button>
  )
}
