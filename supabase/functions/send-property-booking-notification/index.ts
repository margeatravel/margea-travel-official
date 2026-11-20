import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY") as string);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PropertyBookingRequest {
  property_title: string;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_nights: number;
  total_price: number;
  cleaning_fee?: number;
  booking_reference: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const booking: PropertyBookingRequest = await req.json();

    // Send HIGH PRIORITY email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Margea Property Bookings <noreply@margeatravel.com>",
      to: ["admin@margeatravel.com"],
      subject: `🔴 NUEVA RESERVA - ${booking.property_title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔴 Nueva Reserva Confirmada</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Pago procesado exitosamente</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">📍 Información de la Propiedad</h2>
            <p style="font-size: 18px; font-weight: bold; color: #667eea; margin: 5px 0;">${booking.property_title}</p>
            
            <h2 style="color: #333; margin-top: 25px;">👤 Información del Huésped</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Nombre:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.guest_name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
                <td style="padding: 8px 0; color: #333;">${booking.guest_email}</td>
              </tr>
              ${booking.guest_phone ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Teléfono:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${booking.guest_phone}</td>
                </tr>
              ` : ''}
            </table>
            
            <h2 style="color: #333; margin-top: 25px;">📅 Detalles de la Reserva</h2>
            <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
              <tr style="background: #667eea; color: white;">
                <td style="padding: 12px; font-weight: bold;">Check-in</td>
                <td style="padding: 12px; font-weight: bold;">Check-out</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${booking.check_in}</td>
                <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${booking.check_out}</td>
              </tr>
              <tr>
                <td style="padding: 12px; color: #666;"><strong>Noches:</strong></td>
                <td style="padding: 12px;">${booking.total_nights}</td>
              </tr>
              <tr>
                <td style="padding: 12px; color: #666;"><strong>Huéspedes:</strong></td>
                <td style="padding: 12px;">${booking.guests}</td>
              </tr>
              ${booking.cleaning_fee ? `<tr>
                <td style="padding: 12px; color: #666;"><strong>Tarifa de limpieza / Cleaning fee:</strong></td>
                <td style="padding: 12px;">$${Number(booking.cleaning_fee).toLocaleString('en-US')} MXN</td>
              </tr>` : ""}
              <tr style="background: #f0f4ff;">
                <td style="padding: 12px; font-weight: bold; color: #333;">Total Pagado:</td>
                <td style="padding: 12px; font-weight: bold; color: #667eea; font-size: 20px;">$${booking.total_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</td>
              </tr>
            </table>
            
            <div style="margin-top: 25px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
              <p style="margin: 0; color: #856404;"><strong>Referencia de Reserva:</strong> ${booking.booking_reference}</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              <em>Email enviado automáticamente desde el sistema de reservas de Margea</em>
            </p>
          </div>
        </div>
      `,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'High'
      }
    });

    console.log("HIGH PRIORITY admin email sent successfully:", adminEmailResponse);

    // Send confirmation email to guest
    const guestEmailResponse = await resend.emails.send({
      from: "Margea <noreply@margeatravel.com>",
      to: [booking.guest_email],
      subject: `Confirmación de Reserva - ${booking.property_title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">¡Reserva Confirmada!</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Gracias por tu reserva, ${booking.guest_name}</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              Hemos recibido tu pago y confirmado tu reserva en <strong>${booking.property_title}</strong>.
            </p>
            
            <h2 style="color: #333; margin-top: 25px;">📅 Detalles de tu Estadía</h2>
            <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
              <tr style="background: #667eea; color: white;">
                <td style="padding: 12px; font-weight: bold;">Check-in</td>
                <td style="padding: 12px; font-weight: bold;">Check-out</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${booking.check_in}</td>
                <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${booking.check_out}</td>
              </tr>
              <tr>
                <td style="padding: 12px; color: #666;"><strong>Noches:</strong></td>
                <td style="padding: 12px;">${booking.total_nights}</td>
              </tr>
              <tr>
                <td style="padding: 12px; color: #666;"><strong>Huéspedes:</strong></td>
                <td style="padding: 12px;">${booking.guests}</td>
              </tr>
              ${booking.cleaning_fee ? `<tr>
                <td style="padding: 12px; color: #666;"><strong>Tarifa de limpieza / Cleaning fee:</strong></td>
                <td style="padding: 12px;">$${Number(booking.cleaning_fee).toLocaleString('en-US')} MXN</td>
              </tr>` : ""}
              <tr style="background: #f0f4ff;">
                <td style="padding: 12px; font-weight: bold; color: #333;">Total Pagado:</td>
                <td style="padding: 12px; font-weight: bold; color: #667eea; font-size: 20px;">$${booking.total_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</td>
              </tr>
            </table>
            
            <div style="margin-top: 25px; padding: 15px; background: #d1ecf1; border-left: 4px solid #17a2b8; border-radius: 4px;">
              <p style="margin: 0; color: #0c5460;"><strong>Tu Número de Referencia:</strong> ${booking.booking_reference}</p>
              <p style="margin: 10px 0 0 0; color: #0c5460; font-size: 14px;">Guarda este número para cualquier consulta sobre tu reserva.</p>
            </div>
            
            <div style="margin-top: 25px; padding: 20px; background: white; border-radius: 8px; border: 1px solid #e0e0e0;">
              <h3 style="color: #333; margin-top: 0;">📞 ¿Necesitas Ayuda?</h3>
              <p style="color: #666; margin: 5px 0;">Nuestro equipo está disponible para ayudarte:</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> admin@margeatravel.com</p>
              <p style="margin: 5px 0;"><strong>Teléfono:</strong> +52 998 233 4867</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              Saludos,<br>
              <strong>El Equipo de Margea</strong>
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
    console.error("Error in send-property-booking-notification function:", error);
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
