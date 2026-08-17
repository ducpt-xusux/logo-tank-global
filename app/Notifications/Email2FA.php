<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Lang;

class Email2FA extends Notification
{
    public string $token;

    /**
     * Create a new notification instance.
     */
    public function __construct($token)
    {
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(Lang::get('Two-Factor Authentication Code'))
            ->line(Lang::get('You are receiving this email because you are attempting to enable Two-Factor Authentication on your account.'))
            ->line(Lang::get('To complete this process, please enter the following verification code:'))
            ->line("**{$this->token}**") // 6-digit code
            ->line(Lang::get('This code will expire in 10 minutes for security reasons.'))
            ->line(Lang::get('If you did not attempt to enable Two-Factor Authentication, please ignore this message.'));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
