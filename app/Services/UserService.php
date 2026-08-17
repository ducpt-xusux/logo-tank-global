namespace App\Services;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class UserService {
    // Viết 1 lần ở đây
    public function applyDesignerFilter(Builder $query): Builder {
        return $query->where('role', 'designer');
    }
}