<?php

use App\Models\Logo;
use App\Models\User;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DesignerWorkflowTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Cache::forever('price_settings', collect());

        Schema::create('users', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('name_kana')->nullable();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->string('role', 10)->nullable()->default('user');
            $table->tinyInteger('first_login')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('lt_t_logo', function (Blueprint $table): void {
            $table->bigIncrements('logo_id');
            $table->tinyInteger('state')->default(0);
            $table->dateTime('reg_date')->nullable();
            $table->dateTime('up_date')->nullable();
            $table->string('reg_by', 128)->nullable();
            $table->string('up_by', 128)->nullable();
            $table->string('logo_name', 128)->nullable();
            $table->text('logo_explain')->nullable();
            $table->string('logo_d_id', 16)->nullable();
            $table->integer('tank_num')->default(0);
            $table->string('reg_user', 100)->nullable();
            $table->string('last_sync_at')->nullable();
            $table->softDeletes();
        });

        Schema::create('lt_logo_languages', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('logo_id');
            $table->string('create_by')->nullable();
            $table->string('vi')->nullable();
            $table->string('en')->nullable();
            $table->string('ja')->nullable();
            $table->timestamps();
        });
    }

    protected function tearDown(): void
    {
        Schema::dropIfExists('lt_logo_languages');
        Schema::dropIfExists('lt_t_logo');
        Schema::dropIfExists('users');

        parent::tearDown();
    }

    public function test_it_seeds_a_verified_designer_account(): void
    {
        $seederClass = 'Database\\Seeders\\DesignerSeeder';

        $this->assertTrue(class_exists($seederClass));

        $this->seed($seederClass);

        $designer = User::query()
            ->where('email', 'designer@example.com')
            ->first();

        $this->assertNotNull($designer);
        $this->assertSame('designer', $designer->role);
        $this->assertNotNull($designer->email_verified_at);
        $this->assertTrue(Hash::check('designer123', $designer->password));
    }

    public function test_seeded_designer_can_log_in_and_access_the_admin_dashboard(): void
    {
        $seederClass = 'Database\\Seeders\\DesignerSeeder';

        $this->assertTrue(class_exists($seederClass));

        $this->seed($seederClass);
        $this->withoutVite();

        $loginResponse = $this->post('/login', [
            'email' => 'designer@example.com',
            'password' => 'designer123',
        ]);

        $designer = User::query()->where('email', 'designer@example.com')->firstOrFail();

        $this->assertAuthenticatedAs($designer);
        $loginResponse->assertRedirect();

        $this->get(route('admin.dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/dashboard')
            );
    }

    public function test_seeded_designer_can_create_and_view_their_design(): void
    {
        $seederClass = 'Database\\Seeders\\DesignerSeeder';

        $this->assertTrue(class_exists($seederClass));

        $this->seed($seederClass);
        $this->withoutVite();

        $this->post('/login', [
            'email' => 'designer@example.com',
            'password' => 'designer123',
        ])->assertRedirect();

        $createResponse = $this->post(route('admin.logo.store'), [
            'logo_name' => 'デザイナーテスト',
            'logo_name_vn' => 'Thiết kế thử nghiệm',
            'logo_name_en' => 'Designer test',
            'logo_explain' => 'デザイナーが作成したテストデザインです。',
            'logo_d_id' => 'DESIGNER-TEST',
            'reg_by' => 'Admin override attempt',
        ]);

        $logo = Logo::query()->where('logo_name', 'デザイナーテスト')->firstOrFail();

        $this->assertSame('Designer', $logo->reg_by);
        $this->assertDatabaseHas('lt_logo_languages', [
            'logo_id' => $logo->logo_id,
            'create_by' => 'Designer',
            'ja' => 'デザイナーテスト',
            'vi' => 'Thiết kế thử nghiệm',
            'en' => 'Designer test',
        ]);

        $createResponse->assertRedirect(route('admin.logo.detail', $logo->logo_id, absolute: false));

        $this->get(route('admin.dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/dashboard')
                ->has('logos.data', 1)
                ->where('logos.data.0.logo_id', $logo->logo_id)
                ->where('logos.data.0.logo_name', 'デザイナーテスト')
                ->where('logos.data.0.reg_by', 'Designer')
            );
    }
}
