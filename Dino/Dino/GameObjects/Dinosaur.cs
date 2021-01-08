using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Shapes;

namespace Dino.GameObjects
{
    public class Dinosaur : GameObject
    {
        private Game Game { get; set; }
        private Ellipse Circle { get; set; }
        public Dinosaur(Game game)
        {
            this.Game = game;

            this.Circle = new Ellipse()
            {
                Width = 20,
                Height = 20,
                StrokeThickness = 2,
                Stroke = Brushes.White,
                Fill = Brushes.White
            };
        }
        
        public override void Render(Canvas canvas)
        {
            //dino
            Canvas.SetTop(Circle, Game.Height - 80);
            Canvas.SetLeft(Circle, 20);
            
            if (!canvas.Children.Contains(Circle))
            {

            }
            canvas.Children.Add(Circle);
        }

        public async void Jump()
        {
            Canvas.SetTop(Circle, Game.Height - 200);
            await System.Threading.Tasks.Task.Delay(200);
            Canvas.SetTop(Circle, Game.Height - 100);
        }

        public override void HandleKeyPress(object s, KeyEventArgs e)
        {
            Jump();
        }
    }
}
