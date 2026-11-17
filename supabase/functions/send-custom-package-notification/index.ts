import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY") as string);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CustomPackageRequest {
  name: string;
  email: string;
  phone?: string;
  budget: number;
  interests: {
    stay: boolean;
    tour: boolean;
    yacht: boolean;
    scubaDiving: boolean;
    concierge: boolean;
  };
  check_in?: string;
  check_out?: string;
  guests: number;
  special_requests?: string;
  confirmation_number: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const packageRequest: CustomPackageRequest = await req.json();

    // Format interests
    const selectedInterests = Object.entries(packageRequest.interests)
      .filter(([_, value]) => value)
      .map(([key, _]) => {
        const interestLabels: { [key: string]: string } = {
          stay: "Alojamiento",
          tour: "Tours",
          yacht: "Yates",
          scubaDiving: "Buceo",
          concierge: "Servicios de Concierge"
        };
        return interestLabels[key] || key;
      })
      .join(", ");

    // Send HIGH PRIORITY email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Margea Custom Packages <onboarding@resend.dev>",
      to: ["admin@margeatravel.com"],
      subject: `🔴 NUEVA SOLICITUD DE PAQUETE - ${packageRequest.name}`,
      html: `
        <h1>Nueva Solicitud de Paquete Personalizado</h1>
        
        <h2>Información del Cliente</h2>
        <p><strong>Nombre:</strong> ${packageRequest.name}</p>
        <p><strong>Email:</strong> ${packageRequest.email}</p>
        ${packageRequest.phone ? `<p><strong>Teléfono:</strong> ${packageRequest.phone}</p>` : ''}
        
        <h2>Preferencias del Paquete</h2>
        <p><strong>Presupuesto:</strong> $${packageRequest.budget.toLocaleString('en-US')} USD</p>
        <p><strong>Intereses:</strong> ${selectedInterests || 'Ninguno seleccionado'}</p>
        
        <h2>Detalles del Viaje</h2>
        ${packageRequest.check_in ? `<p><strong>Check-in:</strong> ${packageRequest.check_in}</p>` : ''}
        ${packageRequest.check_out ? `<p><strong>Check-out:</strong> ${packageRequest.check_out}</p>` : ''}
        <p><strong>Número de Huéspedes:</strong> ${packageRequest.guests}</p>
        
        ${packageRequest.special_requests ? `
          <h2>Solicitudes Especiales</h2>
          <p>${packageRequest.special_requests.replace(/\n/g, '<br>')}</p>
        ` : ''}
        
        <p><strong>Número de Confirmación:</strong> ${packageRequest.confirmation_number}</p>
        <hr>
        <p><em>Enviado desde el formulario de paquetes personalizados de Margea</em></p>
      `,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'High'
      }
    });

    console.log("Admin email sent successfully:", adminEmailResponse);

    // Send confirmation email to customer with complete details
    const customerEmailResponse = await resend.emails.send({
      from: "Margea <onboarding@resend.dev>",
      to: [packageRequest.email],
      subject: "✅ Confirmación - Solicitud de Paquete Personalizado Margea",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">✨ ¡Solicitud Recibida!</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Paquete Personalizado</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              Hola <strong>${packageRequest.name}</strong>,
            </p>
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              Hemos recibido tu solicitud para un paquete personalizado. Nuestro equipo diseñará una experiencia única basada en tus preferencias.
            </p>
            
            <div style="margin-top: 25px; padding: 20px; background: white; border-radius: 8px; border: 2px solid #667eea;">
              <h2 style="color: #667eea; margin-top: 0; font-size: 20px;">📋 Resumen de tu Solicitud</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: bold;">Presupuesto:</td>
                  <td style="padding: 10px 0; color: #333; font-size: 18px; font-weight: bold; color: #667eea;">$${packageRequest.budget.toLocaleString('en-US')} USD</td>
                </tr>
                ${packageRequest.check_in && packageRequest.check_out ? `
                  <tr>
                    <td style="padding: 10px 0; color: #666; font-weight: bold;">Fechas:</td>
                    <td style="padding: 10px 0; color: #333;">${packageRequest.check_in} al ${packageRequest.check_out}</td>
                  </tr>
                ` : ''}
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: bold;">Huéspedes:</td>
                  <td style="padding: 10px 0; color: #333;">${packageRequest.guests}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: bold;">Intereses:</td>
                  <td style="padding: 10px 0; color: #333;">${selectedInterests || 'Por definir'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: bold;">Número de Referencia:</td>
                  <td style="padding: 10px 0; color: #667eea; font-weight: bold; font-size: 18px;">${packageRequest.confirmation_number}</td>
                </tr>
              </table>
              
              ${packageRequest.special_requests ? `
                <div style="margin-top: 15px; padding: 15px; background: #f0f4ff; border-radius: 6px;">
                  <p style="margin: 0; color: #666; font-weight: bold;">Solicitudes Especiales:</p>
                  <p style="margin: 10px 0 0 0; color: #333;">${packageRequest.special_requests.replace(/\n/g, '<br>')}</p>
                </div>
              ` : ''}
            </div>
            
            <div style="margin-top: 25px; padding: 20px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
              <h3 style="color: #856404; margin: 0 0 10px 0; font-size: 16px;">📌 Próximos Pasos</h3>
              <ul style="margin: 0; padding-left: 20px; color: #856404;">
                <li style="margin: 5px 0;">Analizaremos tus preferencias en detalle</li>
                <li style="margin: 5px 0;">Te enviaremos una propuesta de paquete personalizado</li>
                <li style="margin: 5px 0;">Ajustaremos el itinerario según tus comentarios</li>
                <li style="margin: 5px 0;">Coordinaremos todos los detalles de reserva</li>
              </ul>
            </div>
            
            <div style="margin-top: 25px; padding: 20px; background: white; border-radius: 8px; border: 1px solid #e0e0e0;">
              <h3 style="color: #333; margin-top: 0; font-size: 18px;">📞 Información de Contacto</h3>
              <p style="color: #666; margin: 5px 0; line-height: 1.8;">
                <strong>Email:</strong> admin@margeatravel.com<br>
                <strong>Teléfono:</strong> +52 998 233 4867<br>
                <strong>WhatsApp:</strong> +52 998 233 4867
              </p>
              <p style="color: #666; font-size: 14px; margin-top: 15px;">
                Para cualquier pregunta, contacta a nuestro equipo usando tu número de referencia: <strong>${packageRequest.confirmation_number}</strong>
              </p>
            </div>
            
            <div style="margin-top: 25px; padding: 15px; background: #e7f3ff; border-radius: 6px; border-left: 4px solid #2196F3;">
              <p style="color: #0d47a1; font-size: 13px; margin: 0; line-height: 1.6;">
                <strong>ℹ️ Nota:</strong> Los paquetes personalizados se diseñan específicamente para ti. Te enviaremos una propuesta detallada con precios, itinerario completo y condiciones de pago y cancelación.
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            <p style="color: #999; font-size: 14px; text-align: center; margin: 0; line-height: 1.6;">
              Saludos,<br>
              <strong style="color: #667eea;">El Equipo de Margea</strong><br>
              <span style="font-size: 12px;">Tu socio de confianza en Riviera Maya</span>
            </p>
          </div>
        </div>
      `,
    });

    console.log("Customer confirmation email sent successfully:", customerEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        adminEmailId: adminEmailResponse.data?.id,
        customerEmailId: customerEmailResponse.data?.id 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-custom-package-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
