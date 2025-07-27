import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAllTemplates } from "@/services/mail.service"
import { type EmailTemplate } from "@/templates"
import { Eye, X } from "lucide-react"

interface TemplateSelectorProps {
  selectedTemplate: string
  onTemplateSelect: (templateId: string) => void
}

export default function TemplateSelector({ selectedTemplate, onTemplateSelect }: TemplateSelectorProps) {
  const [templates] = useState<EmailTemplate[]>(getAllTemplates())
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null)
  const [previewHtml, setPreviewHtml] = useState<string>("")
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)

  const getCategoryColor = (category: EmailTemplate['category']) => {
    switch (category) {
      case 'event':
        return 'bg-blue-100 text-blue-800'
      case 'promotion':
        return 'bg-red-100 text-red-800'
      case 'newsletter':
        return 'bg-green-100 text-green-800'
      case 'notification':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryLabel = (category: EmailTemplate['category']) => {
    switch (category) {
      case 'event':
        return 'Evento'
      case 'promotion':
        return 'Promoción'
      case 'newsletter':
        return 'Newsletter'
      case 'notification':
        return 'Notificación'
      default:
        return category
    }
  }

  const handlePreview = async (template: EmailTemplate) => {
    setIsLoadingPreview(true)
    setPreviewTemplate(template)
    
    try {
      // Import the template content dynamically
      const templateModule = await import(`../templates/${template.id}.html?raw`)
      setPreviewHtml(templateModule.default)
    } catch (error) {
      console.error('Error loading template preview:', error)
      setPreviewHtml('<p>Error loading template preview</p>')
    } finally {
      setIsLoadingPreview(false)
    }
  }

  const closePreview = () => {
    setPreviewTemplate(null)
    setPreviewHtml("")
  }

  // Handle escape key to close preview
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && previewTemplate) {
        closePreview()
      }
    }

    if (previewTemplate) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [previewTemplate])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Seleccionar Plantilla</span>
          </CardTitle>
          <CardDescription>
            Elige la plantilla de correo que deseas enviar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                selectedTemplate === template.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => onTemplateSelect(template.id)}
                >
                  <h3 className="font-medium text-gray-900 mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                  <p className="text-xs text-gray-500 font-mono">{template.subject}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryColor(template.category)}>
                    {getCategoryLabel(template.category)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePreview(template)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">{previewTemplate.name}</h3>
                <p className="text-sm text-gray-600">{previewTemplate.subject}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closePreview}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-4 overflow-auto max-h-[calc(90vh-120px)]">
              {isLoadingPreview ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Cargando vista previa...</span>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden shadow-sm">
                  <div 
                    className="bg-white max-w-full"
                    style={{ 
                      transform: 'scale(0.8)', 
                      transformOrigin: 'top center',
                      maxWidth: '100%',
                      overflow: 'hidden'
                    }}
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                </div>
              )}
            </div>
            
            <div className="p-4 border-t bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {previewTemplate.description}
                </div>
                <Button
                  onClick={() => {
                    onTemplateSelect(previewTemplate.id)
                    closePreview()
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Seleccionar esta plantilla
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 