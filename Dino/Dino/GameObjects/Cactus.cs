using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Shapes;

namespace Dino.GameObjects
{
    public class Cactus : GameObject
    {
        private Game Game { get; set; }
        private Rectangle body { get; set; }
        private double Position { get; set; }

        public Cactus(Game game)
        {
            this.Game = game;
            this.body = new Rectangle()
            {
                Fill = Brushes.Green,
                Height = 30,
                Width = 10
            };

            Position = game.Width;
        }

        public override void Render(Canvas canvas)
        {
            //cactus
            Canvas.SetTop(body, Game.Height - 90);
            Canvas.SetLeft(body, Position);
            canvas.Children.Add(body);
        }

        public override void Update()
        {
            Canvas.SetLeft(body, --Position);
        }
    }
}
