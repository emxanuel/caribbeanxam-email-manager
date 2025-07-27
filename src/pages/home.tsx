import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Mail, Plus, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { sendEmailBulk } from "@/services/mail.service"
import TemplateSelector from "@/components/TemplateSelector"

export default function EmailManager() {
  const [emails, setEmails] = useState<string[]>([])
  const [currentEmail, setCurrentEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("test-event")

  // Función para validar email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Agregar email a la lista
  const addEmail = () => {
    setError("")
    setSuccess("")

    if (!currentEmail.trim()) {
      setError("Por favor ingresa una dirección de correo electrónico")
      return
    }

    if (!isValidEmail(currentEmail)) {
      setError("Por favor ingresa una dirección de correo electrónico válida")
      return
    }

    if (emails.includes(currentEmail.toLowerCase())) {
      setError("Este correo electrónico ya está en la lista")
      return
    }

    setEmails([...emails, currentEmail.toLowerCase()])
    setCurrentEmail("")
    setSuccess("Correo electrónico agregado exitosamente")

    // Limpiar mensaje de éxito después de 3 segundos
    setTimeout(() => setSuccess(""), 3000)
  }

  // Eliminar email de la lista
  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove))
    setError("")
    setSuccess("")
  }

  // Enviar correo a todos
  const sendEmailToAll = async () => {
    if (emails.length === 0) {
      setError("No hay correos electrónicos en la lista")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const result = await sendEmailBulk(emails, selectedTemplate)
      
      if (result.totalSent > 0) {
        setSuccess(
          `¡Correos enviados exitosamente! ${result.totalSent} de ${emails.length} correos fueron enviados correctamente.${
            result.totalFailed > 0 ? ` ${result.totalFailed} correos fallaron.` : ""
          }`
        )
        
        // Optionally clear the list after successful send
        // setEmails([])
      } else {
        setError("No se pudo enviar ningún correo. Por favor, verifica la configuración del servicio.")
      }
    } catch (error) {
      console.error("Error sending bulk emails:", error)
      setError(
        error instanceof Error 
          ? `Error al enviar correos: ${error.message}` 
          : "Error inesperado al enviar correos. Por favor, inténtalo de nuevo."
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Manejar Enter en el input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addEmail()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Mail className="h-8 w-8 text-blue-600" />
            Email Manager
          </h1>
          <p className="text-gray-600">Gestiona tu lista de correos electrónicos de forma simple y eficiente</p>
        </div>

        {/* Template Selector */}
        <TemplateSelector 
          selectedTemplate={selectedTemplate}
          onTemplateSelect={setSelectedTemplate}
        />

        {/* Formulario para agregar emails */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Agregar Correo Electrónico
            </CardTitle>
            <CardDescription>
              Ingresa una dirección de correo electrónico válida para agregarla a tu lista
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="ejemplo@correo.com"
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={addEmail} className="sm:w-auto w-full">
                <Plus className="h-4 w-4 mr-2" />
                Agregar
              </Button>
            </div>

            {/* Mensajes de error y éxito */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Lista de emails */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Lista de Correos
              </span>
              <Badge variant="secondary" className="text-sm">
                {emails.length} correo{emails.length !== 1 ? "s" : ""}
              </Badge>
            </CardTitle>
            <CardDescription>Todos los correos electrónicos agregados a tu lista</CardDescription>
          </CardHeader>
          <CardContent>
            {emails.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay correos electrónicos en la lista</p>
                <p className="text-sm">Agrega algunos correos para comenzar</p>
              </div>
            ) : (
              <div className="space-y-2">
                {emails.map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-900 break-all">{email}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEmail(email)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botón para enviar a todos */}
        {emails.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <Button 
                                 onClick={sendEmailToAll} 
                disabled={isLoading || emails.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50" 
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Send className="h-5 w-5 mr-2" />
                )}
                {isLoading ? "Enviando..." : `Enviar Correo a Todos (${emails.length})`}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
