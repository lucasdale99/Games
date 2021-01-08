using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Controls;
using System.Windows.Input;

namespace Dino.GameObjects
{
    public class GameObject
    {
        public virtual void Render(Canvas canvas) { }

        public virtual void Update() { }

        public virtual void HandleKeyPress(object s, KeyEventArgs e) { }
    }
}
