import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY") as string);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface YachtBookingRequest {
  yacht_name: string;
  yacht_size: string;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  requested_date?: string;
  guests?: number;
  duration?: string;
  special_requests?: string;
  confirmation_number: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const booking: YachtBookingRequest = await req.json();

    // Send HIGH PRIORITY email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Margea Yacht Bookings <onboarding@resend.dev>",
      to: ["admin@margeatravel.com"],
      subject: `🔴 NUEVA RESERVA DE YATE - ${booking.yacht_name}`,
      html: `
        <h1>Nueva Solicitud de Reserva de Yate</h1>
        <h2>Información del Yate</h2>
        <p><strong>Yate:</strong> ${booking.yacht_name}</p>
        <p><strong>Tamaño:</strong> ${booking.yacht_size}</p>
        
        <h2>Información del Cliente</h2>
        <p><strong>Nombre:</strong> ${booking.guest_name}</p>
        <p><strong>Email:</strong> ${booking.guest_email}</p>
        ${booking.guest_phone ? `<p><strong>Teléfono:</strong> ${booking.guest_phone}</p>` : ''}
        
        <h2>Detalles de la Reserva</h2>
        ${booking.requested_date ? `<p><strong>Fecha Solicitada:</strong> ${booking.requested_date}</p>` : ''}
        ${booking.guests ? `<p><strong>Número de Huéspedes:</strong> ${booking.guests}</p>` : ''}
        ${booking.duration ? `<p><strong>Duración:</strong> ${booking.duration}</p>` : ''}
        ${booking.special_requests ? `<p><strong>Solicitudes Especiales:</strong><br>${booking.special_requests.replace(/\n/g, '<br>')}</p>` : ''}
        
        <p><strong>Número de Confirmación:</strong> ${booking.confirmation_number}</p>
        <hr>
        <p><em>Enviado desde el formulario de reservas de yates de Margea</em></p>
      `,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'High'
      }
    });

    console.log("Admin email sent successfully:", adminEmailResponse);

    // Send confirmation email to guest with complete details
    const guestEmailResponse = await resend.emails.send({
      from: "Margea <onboarding@resend.dev>",
      to: [booking.guest_email],
      subject: `✅ Confirmación de Reserva - Yate ${booking.yacht_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">⛵ ¡Solicitud Recibida!</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Confirmación de Reserva de Yate</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              Hola <strong>${booking.guest_name}</strong>,
            </p>
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              Hemos recibido tu solicitud de reserva para <strong>${booking.yacht_name}</strong>. Nuestro equipo confirmará la disponibilidad y se pondrá en contacto contigo pronto.
            </p>
            
            <div style="margin-top: 25px; padding: 20px; background: white; border-radius: 8px; border: 2px solid #667eea;">
              <h2 style="color: #667eea; margin-top: 0; font-size: 20px;">⛵ Resumen de tu Reserva</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: bold;">Yate:</td>
                  <td style="padding: 10px 0; color: #333;">${booking.yacht_name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: bold;">Tamaño:</td>
                  <td style="padding: 10px 0; color: #333;">${booking.yacht_size}</td>
                </tr>
                ${booking.requested_date ? `
                  <tr>
                    <td style="padding: 10px 0; color: #666; font-weight: bold;">Fecha Solicitada:</td>
                    <td style="padding: 10px 0; color: #333;">${booking.requested_date}</td>
                  </tr>
                ` : ''}
                ${booking.duration ? `
                  <tr>
                    <td style="padding: 10px 0; color: #666; font-weight: bold;">Duración:</td>
                    <td style="padding: 10px 0; color: #333;">${booking.duration}</td>
                  </tr>
                ` : ''}
                ${booking.guests ? `
                  <tr>
                    <td style="padding: 10px 0; color: #666; font-weight: bold;">Huéspedes:</td>
                    <td style="padding: 10px 0; color: #333;">${booking.guests}</td>
                  </tr>
                ` : ''}
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: bold;">Número de Referencia:</td>
                  <td style="padding: 10px 0; color: #667eea; font-weight: bold; font-size: 18px;">${booking.confirmation_number}</td>
                </tr>
              </table>
              
              ${booking.special_requests ? `
                <div style="margin-top: 15px; padding: 15px; background: #f0f4ff; border-radius: 6px;">
                  <p style="margin: 0; color: #666; font-weight: bold;">Solicitudes Especiales:</p>
                  <p style="margin: 10px 0 0 0; color: #333;">${booking.special_requests.replace(/\n/g, '<br>')}</p>
                </div>
              ` : ''}
            </div>
            
            <div style="margin-top: 25px; padding: 20px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
              <h3 style="color: #856404; margin: 0 0 10px 0; font-size: 16px;">📌 Próximos Pasos</h3>
              <ul style="margin: 0; padding-left: 20px; color: #856404;">
                <li style="margin: 5px 0;">Confirmaremos la disponibilidad del yate</li>
                <li style="margin: 5px 0;">Te enviaremos la cotización final y detalles completos</li>
                <li style="margin: 5px 0;">Coordinaremos el punto de encuentro en la marina</li>
                <li style="margin: 5px 0;">Podrás realizar el pago una vez confirmada la disponibilidad</li>
              </ul>
            </div>
            
            <div style="margin-top: 25px; padding: 20px; background: white; border-radius: 8px; border: 1px solid #e0e0e0;">
              <h3 style="color: #333; margin-top: 0; font-size: 18px;">📞 Información de Contacto</h3>
              <p style="color: #666; margin: 5px 0; line-height: 1.8;">
                <strong>Email:</strong> admin@margeatravel.com<br>
                <strong>Teléfono:</strong> +1 (469) 620 8199<br>
                <strong>WhatsApp:</strong> +1 (469) 620 8199
              </p>
              <p style="color: #666; font-size: 14px; margin-top: 15px;">
                Para cualquier pregunta o cambio, contacta a nuestro equipo usando tu número de referencia: <strong>${booking.confirmation_number}</strong>
              </p>
            </div>
            
            <div style="margin-top: 25px; padding: 15px; background: #e7f3ff; border-radius: 6px; border-left: 4px solid #2196F3;">
              <p style="color: #0d47a1; font-size: 13px; margin: 0; line-height: 1.6;">
                <strong>ℹ️ Información Importante:</strong> Los precios y disponibilidad están sujetos a confirmación. Las políticas de cancelación varían según el proveedor del yate. Te enviaremos todos los detalles una vez confirmemos tu reserva.
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

    console.log("Guest confirmation email sent successfully:", guestEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        adminEmailId: adminEmailResponse.data?.id,
        guestEmailId: guestEmailResponse.data?.id 
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
    console.error("Error in send-yacht-booking-notification function:", error);
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
