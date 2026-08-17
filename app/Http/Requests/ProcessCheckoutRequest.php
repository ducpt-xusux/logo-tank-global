<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProcessCheckoutRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'items' => ['required', 'array', 'min:1'],
            'type' => ['nullable', 'string', 'in:logo,package'],
            'items.*.productId' => ['nullable', 'integer'],
            'items.*.package_id' => ['nullable', 'integer'],
            'items.*.quantity' => ['nullable', 'integer', 'min:1'],
            'items.*.subName' => ['nullable', 'string', 'max:100'],
            'items.*.mainName' => ['nullable', 'string', 'max:100'],
            'items.*.logoManual' => ['required', 'boolean'],
            'items.*.logoMotion' => ['required', 'boolean'],
            'items.*.mainText' => ['nullable', 'boolean'],
            'submittedTotal' => ['nullable', 'numeric', 'min:0'],
            'totalIncludesTax' => ['nullable', 'boolean'],
        ];
    }
}
