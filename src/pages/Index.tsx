import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';

type GameScreen = 'menu' | 'shop' | 'profile' | 'inventory' | 'settings' | 'leaderboard' | 'friends' | 'team-select' | 'game' | 'cases';
type Team = 'ct' | 't' | null;
type Rarity = 'consumer' | 'industrial' | 'milspec' | 'restricted' | 'classified' | 'covert' | 'rare';

interface WeaponSkin {
  id: string;
  weaponName: string;
  skinName: string;
  category: 'rifle' | 'pistol' | 'smg' | 'sniper' | 'knife' | 'gloves';
  rarity: Rarity;
  price: number;
  wear?: number;
  statTrak?: boolean;
  owned: boolean;
  damage: number;
  ammo: number;
}

interface WeaponItem {
  id: string;
  name: string;
  category: 'rifle' | 'pistol' | 'smg' | 'sniper' | 'knife';
  price: number;
  damage: number;
  ammo: number;
  icon: string;
  owned: boolean;
}

interface PlayerStats {
  username: string;
  level: number;
  wins: number;
  kills: number;
  deaths: number;
  balance: number;
}

const Index = () => {
  const [screen, setScreen] = useState<GameScreen>('menu');
  const [team, setTeam] = useState<Team>(null);
  const [buyMenuOpen, setBuyMenuOpen] = useState(false);
  const [currentWeapon, setCurrentWeapon] = useState<WeaponItem | null>(null);
  const [ammo, setAmmo] = useState(30);
  const [maxAmmo, setMaxAmmo] = useState(30);
  const [money, setMoney] = useState(800);
  
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    username: 'Player_2025',
    level: 15,
    wins: 128,
    kills: 1543,
    deaths: 987,
    balance: 15000,
  });

  const weapons: WeaponItem[] = [
    { id: 'ak47', name: 'AK-47', category: 'rifle', price: 2700, damage: 36, ammo: 30, icon: '🔫', owned: false },
    { id: 'm4a4', name: 'M4A4', category: 'rifle', price: 3100, damage: 33, ammo: 30, icon: '🔫', owned: false },
    { id: 'awp', name: 'AWP', category: 'sniper', price: 4750, damage: 115, ammo: 10, icon: '🎯', owned: false },
    { id: 'deagle', name: 'Desert Eagle', category: 'pistol', price: 700, damage: 53, ammo: 7, icon: '🔫', owned: true },
    { id: 'glock', name: 'Glock-18', category: 'pistol', price: 0, damage: 28, ammo: 20, icon: '🔫', owned: true },
    { id: 'mp9', name: 'MP9', category: 'smg', price: 1250, damage: 26, ammo: 30, icon: '🔫', owned: false },
    { id: 'knife', name: 'Butterfly Knife', category: 'knife', price: 5000, damage: 55, ammo: 0, icon: '🔪', owned: false },
    { id: 'knife2', name: 'Karambit', category: 'knife', price: 7500, damage: 55, ammo: 0, icon: '🗡️', owned: false },
  ];

  const [inventory, setInventory] = useState<WeaponItem[]>(weapons.filter(w => w.owned));

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (screen !== 'game') return;
    
    const key = e.key.toLowerCase();
    
    if (key === 'b' || key === 'и') {
      setBuyMenuOpen(prev => !prev);
    }
    
    if (key === 'r' || key === 'к') {
      if (currentWeapon && ammo < maxAmmo) {
        setAmmo(maxAmmo);
      }
    }
  }, [screen, ammo, maxAmmo, currentWeapon]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const buyWeapon = (weapon: WeaponItem) => {
    if (money >= weapon.price && !inventory.find(w => w.id === weapon.id)) {
      setMoney(prev => prev - weapon.price);
      setInventory(prev => [...prev, weapon]);
      setCurrentWeapon(weapon);
      setAmmo(weapon.ammo);
      setMaxAmmo(weapon.ammo);
      setBuyMenuOpen(false);
    }
  };

  const shopBuyWeapon = (weapon: WeaponItem) => {
    if (playerStats.balance >= weapon.price && !inventory.find(w => w.id === weapon.id)) {
      setPlayerStats(prev => ({ ...prev, balance: prev.balance - weapon.price }));
      setInventory(prev => [...prev, weapon]);
    }
  };

  const startGame = (selectedTeam: Team) => {
    setTeam(selectedTeam);
    setScreen('game');
    setMoney(800);
    setCurrentWeapon(weapons.find(w => w.id === 'glock') || null);
    setAmmo(20);
    setMaxAmmo(20);
  };

  const renderMenu = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-background to-blue-900/20" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjIiLz48L2c+PC9zdmc+')] opacity-10" />
      
      <div className="relative z-10 text-center mb-12">
        <h1 className="text-8xl font-bold mb-4 text-glow bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          STRIKE OPS
        </h1>
        <p className="text-2xl text-muted-foreground">Тактический шутер нового поколения</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full relative z-10">
        <Button
          onClick={() => setScreen('team-select')}
          size="lg"
          className="h-24 text-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground group relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-3">
            <Icon name="Crosshair" size={28} />
            ИГРАТЬ
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>

        <Button
          onClick={() => setScreen('shop')}
          size="lg"
          variant="outline"
          className="h-24 text-xl font-bold border-2 hover:bg-primary/10"
        >
          <Icon name="ShoppingCart" size={24} className="mr-2" />
          Магазин
        </Button>

        <Button
          onClick={() => setScreen('profile')}
          size="lg"
          variant="outline"
          className="h-24 text-xl font-bold border-2 hover:bg-secondary/10"
        >
          <Icon name="User" size={24} className="mr-2" />
          Профиль
        </Button>

        <Button
          onClick={() => setScreen('inventory')}
          size="lg"
          variant="outline"
          className="h-24 text-xl font-bold border-2 hover:bg-accent/10"
        >
          <Icon name="Package" size={24} className="mr-2" />
          Инвентарь
        </Button>

        <Button
          onClick={() => setScreen('settings')}
          size="lg"
          variant="outline"
          className="h-24 text-xl font-bold border-2 hover:bg-muted"
        >
          <Icon name="Settings" size={24} className="mr-2" />
          Настройки
        </Button>

        <Button
          onClick={() => setScreen('leaderboard')}
          size="lg"
          variant="outline"
          className="h-24 text-xl font-bold border-2 hover:bg-muted"
        >
          <Icon name="Trophy" size={24} className="mr-2" />
          Лидеры
        </Button>

        <Button
          onClick={() => setScreen('friends')}
          size="lg"
          variant="outline"
          className="h-24 text-xl font-bold border-2 hover:bg-muted"
        >
          <Icon name="Users" size={24} className="mr-2" />
          Друзья
        </Button>

        <Button
          size="lg"
          variant="destructive"
          className="h-24 text-xl font-bold"
        >
          <Icon name="LogOut" size={24} className="mr-2" />
          Выход
        </Button>
      </div>
    </div>
  );

  const renderShop = () => (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold mb-2">Магазин оружия</h1>
            <p className="text-xl text-muted-foreground">Баланс: <span className="text-accent font-bold">${playerStats.balance}</span></p>
          </div>
          <Button onClick={() => setScreen('menu')} variant="outline" size="lg">
            <Icon name="ArrowLeft" className="mr-2" />
            Назад
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="all">Всё оружие</TabsTrigger>
            <TabsTrigger value="rifle">Винтовки</TabsTrigger>
            <TabsTrigger value="pistol">Пистолеты</TabsTrigger>
            <TabsTrigger value="sniper">Снайперские</TabsTrigger>
            <TabsTrigger value="knife">Ножи</TabsTrigger>
          </TabsList>

          {['all', 'rifle', 'pistol', 'sniper', 'knife'].map(category => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {weapons
                  .filter(w => category === 'all' || w.category === category)
                  .map(weapon => (
                    <Card key={weapon.id} className="weapon-card p-6 border-2 relative">
                      {inventory.find(w => w.id === weapon.id) && (
                        <Badge className="absolute top-2 right-2 bg-green-500">Куплено</Badge>
                      )}
                      <div className="text-6xl mb-4 text-center">{weapon.icon}</div>
                      <h3 className="text-2xl font-bold mb-2">{weapon.name}</h3>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Урон:</span>
                          <span className="font-bold">{weapon.damage}</span>
                        </div>
                        {weapon.ammo > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Патроны:</span>
                            <span className="font-bold">{weapon.ammo}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Цена:</span>
                          <span className="font-bold text-accent">${weapon.price}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => shopBuyWeapon(weapon)}
                        disabled={playerStats.balance < weapon.price || !!inventory.find(w => w.id === weapon.id)}
                        className="w-full"
                      >
                        {inventory.find(w => w.id === weapon.id) ? 'Куплено' : 'Купить'}
                      </Button>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Button onClick={() => setScreen('menu')} variant="outline" size="lg" className="mb-8">
          <Icon name="ArrowLeft" className="mr-2" />
          Назад
        </Button>

        <Card className="p-8 border-2">
          <div className="flex items-center gap-8 mb-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-6xl">
              👤
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{playerStats.username}</h1>
              <div className="flex items-center gap-4">
                <Badge className="text-lg px-4 py-1">Уровень {playerStats.level}</Badge>
                <span className="text-muted-foreground">K/D: {(playerStats.kills / playerStats.deaths).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Прогресс до {playerStats.level + 1} уровня</span>
              <span className="font-bold">75%</span>
            </div>
            <Progress value={75} className="h-3" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Icon name="Trophy" size={32} className="mx-auto mb-2 text-accent" />
              <div className="text-3xl font-bold mb-1">{playerStats.wins}</div>
              <div className="text-sm text-muted-foreground">Побед</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Icon name="Target" size={32} className="mx-auto mb-2 text-primary" />
              <div className="text-3xl font-bold mb-1">{playerStats.kills}</div>
              <div className="text-sm text-muted-foreground">Убийств</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Icon name="Skull" size={32} className="mx-auto mb-2 text-destructive" />
              <div className="text-3xl font-bold mb-1">{playerStats.deaths}</div>
              <div className="text-sm text-muted-foreground">Смертей</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Icon name="DollarSign" size={32} className="mx-auto mb-2 text-accent" />
              <div className="text-3xl font-bold mb-1">${playerStats.balance}</div>
              <div className="text-sm text-muted-foreground">Баланс</div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Достижения</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 border-primary border-2">
                <div className="text-4xl mb-2">🏆</div>
                <h3 className="font-bold mb-1">Первая кровь</h3>
                <p className="text-sm text-muted-foreground">Совершите первое убийство</p>
              </Card>
              <Card className="p-4 border-2">
                <div className="text-4xl mb-2">⭐</div>
                <h3 className="font-bold mb-1">Снайпер</h3>
                <p className="text-sm text-muted-foreground">100 убийств из снайперской винтовки</p>
              </Card>
              <Card className="p-4 border-2 opacity-50">
                <div className="text-4xl mb-2">🔥</div>
                <h3 className="font-bold mb-1">Неудержимый</h3>
                <p className="text-sm text-muted-foreground">10 побед подряд</p>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold">Инвентарь</h1>
          <Button onClick={() => setScreen('menu')} variant="outline" size="lg">
            <Icon name="ArrowLeft" className="mr-2" />
            Назад
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {inventory.map(weapon => (
            <Card key={weapon.id} className="weapon-card p-6 border-2">
              <div className="text-6xl mb-4 text-center">{weapon.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{weapon.name}</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Урон:</span>
                  <span className="font-bold">{weapon.damage}</span>
                </div>
                {weapon.ammo > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Патроны:</span>
                    <span className="font-bold">{weapon.ammo}</span>
                  </div>
                )}
                <Badge className="w-full justify-center bg-green-500 mt-4">В собственности</Badge>
              </div>
            </Card>
          ))}
          {inventory.length === 0 && (
            <div className="col-span-full text-center py-20">
              <Icon name="Package" size={64} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-2xl text-muted-foreground">Инвентарь пуст</p>
              <Button onClick={() => setScreen('shop')} className="mt-4" size="lg">
                Перейти в магазин
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTeamSelect = () => (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-background to-secondary/20" />
      
      <div className="relative z-10 max-w-6xl w-full">
        <h1 className="text-6xl font-bold text-center mb-12 text-glow">Выберите команду</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card
            onClick={() => startGame('ct')}
            className="p-12 border-4 border-primary hover:border-primary/50 cursor-pointer transition-all hover:scale-105 bg-gradient-to-br from-primary/20 to-background"
          >
            <div className="text-center">
              <div className="text-8xl mb-6">🛡️</div>
              <h2 className="text-4xl font-bold mb-4 text-primary">Counter-Terrorists</h2>
              <p className="text-xl text-muted-foreground mb-6">Защищайте позиции и обезвреживайте бомбы</p>
              <Badge className="text-lg px-6 py-2 bg-primary">Спецназ</Badge>
            </div>
          </Card>

          <Card
            onClick={() => startGame('t')}
            className="p-12 border-4 border-secondary hover:border-secondary/50 cursor-pointer transition-all hover:scale-105 bg-gradient-to-br from-secondary/20 to-background"
          >
            <div className="text-center">
              <div className="text-8xl mb-6">💣</div>
              <h2 className="text-4xl font-bold mb-4 text-secondary">Terrorists</h2>
              <p className="text-xl text-muted-foreground mb-6">Установите бомбу и удержите позицию</p>
              <Badge className="text-lg px-6 py-2 bg-secondary">Атакующие</Badge>
            </div>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button onClick={() => setScreen('menu')} variant="outline" size="lg">
            <Icon name="ArrowLeft" className="mr-2" />
            Назад в меню
          </Button>
        </div>
      </div>
    </div>
  );

  const renderGame = () => (
    <div className="min-h-screen relative bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="crosshair" />
      
      <div className="absolute top-4 left-4 z-20">
        <Card className="p-4 bg-card/80 backdrop-blur">
          <div className="flex items-center gap-4">
            <Badge className={team === 'ct' ? 'bg-primary' : 'bg-secondary'}>
              {team === 'ct' ? 'CT' : 'T'}
            </Badge>
            <div className="text-sm">
              <div className="flex items-center gap-2">
                <Icon name="DollarSign" size={16} />
                <span className="font-bold">${money}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <Card className="p-4 bg-card/80 backdrop-blur">
          <div className="text-sm font-bold">5:5</div>
        </Card>
      </div>

      <div className="absolute bottom-8 right-8 z-20">
        <div className="text-right">
          <div className="ammo-counter text-primary">
            {currentWeapon ? ammo : '-'} / {currentWeapon ? maxAmmo : '-'}
          </div>
          {currentWeapon && (
            <div className="text-xl font-bold text-muted-foreground">{currentWeapon.name}</div>
          )}
          <div className="text-sm text-muted-foreground mt-2">
            [R] Перезарядка | [B/И] Закуп
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-4">
        <div className="text-7xl">
          {currentWeapon?.icon || '🔫'}
        </div>
      </div>

      {buyMenuOpen && (
        <div className="absolute inset-0 game-overlay z-30 flex items-center justify-center p-8">
          <Card className="max-w-4xl w-full p-8 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Меню закупа</h2>
              <Button onClick={() => setBuyMenuOpen(false)} variant="ghost" size="sm">
                <Icon name="X" />
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {weapons.filter(w => w.category !== 'knife').map(weapon => (
                <Card
                  key={weapon.id}
                  onClick={() => buyWeapon(weapon)}
                  className={`p-4 cursor-pointer transition-all hover:border-primary ${
                    money < weapon.price ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="text-4xl mb-2 text-center">{weapon.icon}</div>
                  <h3 className="font-bold mb-2 text-center">{weapon.name}</h3>
                  <div className="text-center">
                    <Badge className={money >= weapon.price ? 'bg-accent' : 'bg-muted'}>
                      ${weapon.price}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Icon name="Crosshair" size={48} className="mx-auto mb-4" />
          <p className="text-xl">Используйте W A S D для движения</p>
          <p className="text-xl">Нажмите B или И для меню закупа</p>
          <p className="text-xl mt-4">Прицел в центре экрана</p>
        </div>
      </div>

      <Button
        onClick={() => setScreen('menu')}
        variant="outline"
        className="absolute top-4 left-1/2 -translate-x-1/2 z-20"
      >
        <Icon name="Home" className="mr-2" />
        Выйти в меню
      </Button>
    </div>
  );

  const renderSettings = () => (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold">Настройки</h1>
          <Button onClick={() => setScreen('menu')} variant="outline" size="lg">
            <Icon name="ArrowLeft" className="mr-2" />
            Назад
          </Button>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Icon name="Monitor" />
              Графика
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Качество графики</span>
                <Badge>Высокое</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Разрешение</span>
                <Badge>1920x1080</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Icon name="Volume2" />
              Звук
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Громкость</span>
                <Badge>80%</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Icon name="Keyboard" />
              Управление
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Движение:</span>
                <span className="font-bold">W A S D</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Меню закупа:</span>
                <span className="font-bold">B / И</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Перезарядка:</span>
                <span className="font-bold">R / К</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold">Таблица лидеров</h1>
          <Button onClick={() => setScreen('menu')} variant="outline" size="lg">
            <Icon name="ArrowLeft" className="mr-2" />
            Назад
          </Button>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            {[
              { rank: 1, name: 'ProGamer_2025', rating: 2450, icon: '🥇' },
              { rank: 2, name: 'SnipeKing', rating: 2380, icon: '🥈' },
              { rank: 3, name: 'TacticalMaster', rating: 2310, icon: '🥉' },
              { rank: 4, name: 'Player_2025', rating: 2150, icon: '🏅' },
              { rank: 5, name: 'ShadowHunter', rating: 2050, icon: '🏅' },
            ].map((player) => (
              <div
                key={player.rank}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  player.name === playerStats.username
                    ? 'bg-primary/20 border-2 border-primary'
                    : 'bg-muted'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{player.icon}</span>
                  <div>
                    <div className="font-bold text-lg">{player.name}</div>
                    <div className="text-sm text-muted-foreground">Рейтинг: {player.rating}</div>
                  </div>
                </div>
                <Badge className="text-lg px-4 py-1">#{player.rank}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderFriends = () => (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold">Друзья</h1>
          <Button onClick={() => setScreen('menu')} variant="outline" size="lg">
            <Icon name="ArrowLeft" className="mr-2" />
            Назад
          </Button>
        </div>

        <div className="grid gap-4">
          {[
            { name: 'SnipeKing', status: 'В игре', online: true },
            { name: 'TacticalMaster', status: 'В лобби', online: true },
            { name: 'ShadowHunter', status: 'Не в сети', online: false },
          ].map((friend, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl">
                    👤
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{friend.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${friend.online ? 'bg-green-500' : 'bg-gray-500'}`} />
                      <span className="text-sm text-muted-foreground">{friend.status}</span>
                    </div>
                  </div>
                </div>
                <Button disabled={!friend.online}>
                  <Icon name="Users" className="mr-2" />
                  Пригласить
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-8 mt-8 text-center border-dashed">
          <Icon name="UserPlus" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-bold mb-2">Добавить друга</h3>
          <p className="text-muted-foreground mb-4">Введите никнейм игрока</p>
          <Button>
            <Icon name="UserPlus" className="mr-2" />
            Добавить
          </Button>
        </Card>
      </div>
    </div>
  );

  return (
    <>
      {screen === 'menu' && renderMenu()}
      {screen === 'shop' && renderShop()}
      {screen === 'profile' && renderProfile()}
      {screen === 'inventory' && renderInventory()}
      {screen === 'settings' && renderSettings()}
      {screen === 'leaderboard' && renderLeaderboard()}
      {screen === 'friends' && renderFriends()}
      {screen === 'team-select' && renderTeamSelect()}
      {screen === 'game' && renderGame()}
    </>
  );
};

export default Index;