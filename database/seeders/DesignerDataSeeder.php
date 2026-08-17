<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DesignerDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $designers = [
            ['email' => 'nunso', 'name' => 'nunso', 'password' => bcrypt('gama12345'), 'role' => 'designer'],
            ['email' => 'nagisa1234', 'name' => 'nagisa1234', 'password' => bcrypt('54sfasdf'), 'role' => 'designer'],
            ['email' => 'asai', 'name' => 'asai', 'password' => bcrypt('S52aSd545SDsdAk'), 'role' => 'designer'],
            ['email' => 'higa', 'name' => 'higa', 'password' => bcrypt('S88Bfs214asdGD0'), 'role' => 'designer'],
            ['email' => 'kaneko', 'name' => 'kaneko', 'password' => bcrypt('9e4vKYUmi50oEsv'), 'role' => 'designer'],
            ['email' => 'vainstain', 'name' => 'vainstain', 'password' => bcrypt('052cnvXFBdf3xd1'), 'role' => 'designer'],
            ['email' => 'kishi', 'name' => 'kishi', 'password' => bcrypt('a54c1sdDGakSChm'), 'role' => 'designer'],
            ['email' => 'takemoto', 'name' => 'takemoto', 'password' => bcrypt('YKY5f2dG5CDGadf'), 'role' => 'designer'],
            ['email' => '091takayama', 'name' => '091takayama', 'password' => bcrypt('A0fCaDda2sdg5Kd'), 'role' => 'designer'],
            ['email' => 'sekikawa', 'name' => 'sekikawa', 'password' => bcrypt('WsaK5aDUi5As5'), 'role' => 'designer'],
            ['email' => 'fijimoto', 'name' => 'fijimoto', 'password' => bcrypt('UmW05i5Ac45Sf'), 'role' => 'designer'],
            ['email' => '090benibayashi', 'name' => '090benibayashi', 'password' => bcrypt('1d0aR5G5AAdfE'), 'role' => 'designer'],
            ['email' => '032tukakoshi', 'name' => '032tukakoshi', 'password' => bcrypt('1d0aR5G5AAdfE'), 'role' => 'designer'],
            ['email' => '092shimogama', 'name' => '092shimogama', 'password' => bcrypt('4a5DkSChcm'), 'role' => 'designer'],
            ['email' => '093goshomura', 'name' => '093goshomura', 'password' => bcrypt('9dKkG0k1Uh'), 'role' => 'designer'],
            ['email' => '094smithkaori', 'name' => '094smithkaori', 'password' => bcrypt('kiKsk090o9'), 'role' => 'designer'],
            ['email' => '098murakami', 'name' => '098murakami', 'password' => bcrypt('7qo24sda4we'), 'role' => 'designer'],
            ['email' => '099makihira', 'name' => '099makihira', 'password' => bcrypt('jkf3FSwDsia'), 'role' => 'designer'],
            ['email' => '097igarashi', 'name' => '097igarashi', 'password' => bcrypt('AgkDlnfl2Gp'), 'role' => 'designer'],
            ['email' => '052usui', 'name' => '052usui', 'password' => bcrypt('25vXimU'), 'role' => 'designer'],
            ['email' => '101tanakachigeru', 'name' => '101tanakachigeru', 'password' => bcrypt('20sXaDi4RmU'), 'role' => 'designer'],
            ['email' => '102urakabe', 'name' => '102urakabe', 'password' => bcrypt('5vFSwXpa5ig'), 'role' => 'designer'],
            ['email' => '103nijidesign', 'name' => '103nijidesign', 'password' => bcrypt('XSd05pCAaf5'), 'role' => 'designer'],
            ['email' => '104nihei', 'name' => '104nihei', 'password' => bcrypt('vGhkaR5Ad1i'), 'role' => 'designer'],
            ['email' => '105doisatsuki', 'name' => '105doisatsuki', 'password' => bcrypt('ma5EFSw5Dga'), 'role' => 'designer'],
            ['email' => '110iida', 'name' => '110iida', 'password' => bcrypt('pCdaX05d'), 'role' => 'designer'],
            ['email' => '111hirayama', 'name' => '111hirayama', 'password' => bcrypt('X90oAk9gk'), 'role' => 'designer'],
            ['email' => '109nobata', 'name' => '109nobata', 'password' => bcrypt('X90oAk9gk'), 'role' => 'designer'],
            ['email' => '113ueno', 'name' => '113ueno', 'password' => bcrypt('w0koAk9FS'), 'role' => 'designer'],
            ['email' => '114Navneet', 'name' => '114Navneet', 'password' => bcrypt('Diw5FS4Xk'), 'role' => 'designer'],
            ['email' => '115nishimurarui', 'name' => '115nishimurarui', 'password' => bcrypt('Rk1ia5hjD'), 'role' => 'designer'],
            ['email' => '117nishioka', 'name' => '117nishioka', 'password' => bcrypt('a5wDRk1Fo'), 'role' => 'designer'],
            ['email' => '118okamura', 'name' => '118okamura', 'password' => bcrypt('45DSChak'), 'role' => 'designer'],
            ['email' => '119oomori', 'name' => '119oomori', 'password' => bcrypt('1ijDRa5hk'), 'role' => 'designer'],
            ['email' => '120ooyama', 'name' => '120ooyama', 'password' => bcrypt('Q73jEuOlXg'), 'role' => 'designer'],
            ['email' => '121mizuhodesign', 'name' => '121mizuhodesign', 'password' => bcrypt('KtRuBzsNj6'), 'role' => 'designer'],
            ['email' => '122kawashima', 'name' => '122kawashima', 'password' => bcrypt('7OOpjWpIrJ'), 'role' => 'designer'],
            ['email' => '123yanase', 'name' => '123yanase', 'password' => bcrypt('kaen18lzKa'), 'role' => 'designer'],
            ['email' => '124aonetokyo', 'name' => '124aonetokyo', 'password' => bcrypt('vNAB1OQyjG'), 'role' => 'designer'],
            ['email' => '125yamamoto', 'name' => '125yamamoto', 'password' => bcrypt('8tPtgCkosP'), 'role' => 'designer'],
            ['email' => '125yamamoto_o', 'name' => '125yamamoto_o', 'password' => bcrypt('3yy2Geb16n'), 'role' => 'designer'],
            ['email' => '127_hayashi', 'name' => '127_hayashi', 'password' => bcrypt('sIvj93IoFq'), 'role' => 'designer'],
            ['email' => '128_aotsuka', 'name' => '128_aotsuka', 'password' => bcrypt('xRRCL165A7'), 'role' => 'designer'],
            ['email' => '133noma', 'name' => '133noma', 'password' => bcrypt('R7WwFGUGwO'), 'role' => 'designer'],
            ['email' => '134hirose', 'name' => '134hirose', 'password' => bcrypt('kGKJSaj7jS'), 'role' => 'designer'],
            ['email' => '135kou', 'name' => '135kou', 'password' => bcrypt('97YRSmYB3D'), 'role' => 'designer'],
            ['email' => '137kayamori', 'name' => '137kayamori', 'password' => bcrypt('dC24VC6Sim'), 'role' => 'designer'],
            ['email' => '138ozawa', 'name' => '138ozawa', 'password' => bcrypt('0QInKkZUH6'), 'role' => 'designer'],
            ['email' => '139terada', 'name' => '139terada', 'password' => bcrypt('zHU4LT7jgw'), 'role' => 'designer'],
        ];

        $this->command->getOutput()->progressStart(count($designers));
        foreach ($designers as $designer) {
            User::updateOrCreate(['email' => $designer['email']], $designer);
            $this->command->getOutput()->progressAdvance();
        }
        $this->command->getOutput()->progressFinish();
    }
}
